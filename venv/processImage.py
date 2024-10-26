import torch
import cv2
import numpy as np
import pandas as pd

# Load the pre-trained YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

# Load and preprocess the fridge image
img_path = 'insideFridge1.jpg'
img = cv2.imread(img_path)
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Run object detection on the image
results = model(img_rgb)

# Extract labels and bounding boxes
predictions = results.pandas().xyxy[0]

# Print predictions
print(predictions)
filtered_pred = predictions.query('confidence >= .5')
print(filtered_pred[['name', 'confidence']])  # Shows detected food names and confidence scores

# Count the number of each detected item
food_count = filtered_pred['name'].value_counts()
print("Food count:\n", food_count)

# Optionally display the image with bounding boxes
results.show()

