from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import cv2
import numpy as np
import random
import base64

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}}, methods=["POST"])

# Load the pre-trained YOLOv5 model
model = torch.hub.load("Cruedy/customYolov5", "custom", path="yolov5s.pt") 

# Using personally trained model
# model = torch.hub.load("Cruedy/customYolov5", "custom", path="best.pt") 

@app.route('/predict', methods = ['POST'])
def findFood():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image available"}), 400
        
        # Load the image
        file = request.files['image']
        np_img = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        if img is None:
            print("Failed to decode image")
            return jsonify({"error": "Failed to decode image"}), 400


        # Determine the image file extension (e.g., '.jpg', '.png')
        ext = '.' + file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else '.jpg'
        
        # Run object detection on the image
        results = model(img_rgb)

        # Extract labels and bounding boxes
        predictions = results.pandas().xyxy[0]
        if predictions.empty:
            print("No predictions found")
            return jsonify({"error": "No predictions found"}), 400
        
        filtered_pred = predictions.query('confidence >= 0.15')[['name', 'confidence', 'xmin', 'ymin', 'xmax', 'ymax']]
        
        unique_colors = {}
        def get_separate_colors(name):
            if name not in unique_colors:
                unique_colors[name] = tuple(random.randint(0, 255) for _ in range(3))
            return unique_colors[name]
        
        # Draw bounding boxes with labels
        for i, row in filtered_pred.iterrows():
            label = row['name']
            x1, y1, x2, y2 = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])
            color = get_separate_colors(label)
            cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
            cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_TRIPLEX, 0.6, color, 2)
        
        # Encode the image with the same file extension
        _, buffer = cv2.imencode(ext, img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        # Prepare detected items as JSON
        detected_items = filtered_pred.to_dict(orient='records')

        # Return both the JSON and image with the dynamic format
        return jsonify({"ingredients": detected_items, "image": f"data:image/{ext[1:]};base64,{img_base64}"})
    except Exception as e:
        print("Error occurred in findFood:", str(e))
        return jsonify({"error": str(e)}), 500

