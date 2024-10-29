import os
import torch
import cv2
import numpy as np
import pandas as pd
from ultralytics import YOLO
import random

# Load the pre-trained YOLOv5 model

# model = torch.hub.load(local_yolo_path, 'yolov5s', source='local', pretrained=True)
model = torch.hub.load("Cruedy/customYolov5", "custom", path="yolov5s.pt") 

# Using personally trained model
# model = torch.hub.load("Cruedy/customYolov5", "custom", path="best.pt") 

# Print the modified names to verify
print('Original names:', model.names)

# Load and preprocess the fridge image
img_path = 'insideFridge1.jpg'
img = cv2.imread(img_path)
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Run object detection on the image
results = model(img_rgb)
print('results type', type(results))

# Extract labels and bounding boxes
predictions = results.pandas().xyxy[0]

# Print predictions
print('predictions', predictions[['name', 'confidence']])
filtered_pred = predictions.query('confidence >= .25')
print('filtered', filtered_pred[['name', 'confidence']])  # Shows detected food names and confidence scores

unique_colors = {}
def get_separate_colors(name):
    if name not in unique_colors:
        unique_colors[name] = tuple(random.randint(0, 255) for _ in range(3))
    return unique_colors[name]

# Draw bounding boxes with unique colors per item name
for i, row in filtered_pred.iterrows():
    label = row['name']
    x1, y1, x2, y2 = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])
    color = get_separate_colors(label)
    
    # Draw bounding box and label
    cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
    cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

# Count the number of each detected item
food_count = filtered_pred['name'].value_counts()
print("Food count:\n", food_count)

# Display the image with bounding boxes
cv2.imshow("Detected Objects", img)  # Show original color image with bounding boxes
cv2.waitKey(0)
cv2.destroyAllWindows()