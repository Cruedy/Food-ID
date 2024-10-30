# Tech Stack
I added a middle point with node.js because it helps with security by adding an extra layer of protection between the client side and the backend. The yolov5 model also only worked with python, so I used flask for the backend.

# Features

**Image Upload**
- click on the Choose File Button
- Select Image File to Upload

**Image Preview**
- Image will be previewed on Left Panel

**Identify Food Button**
- Press `Identify Food` Button for the model to run and identify food in the image

**Food List**
- A List of foods containing the number of each food
- If there is more than one of a food, the food name is plural

**Food Bounding Box**
- Bounding box around the food that is identified with the food name
- Foods with the same name are the same color

**Food Highlight**
- When you hover over a food in the `Food List`, the item gets highlighted in the image being previewed on the left

**Link To Description**
- When you click on a food in the `Food List`, you get directed to a link of the wikipedia of the food

## Frontend
**React**
- Framework for javascript frontend

**Tailwind.css**
- CSS framework for styling elements

### Files
**App.js**
- The `App` component is the main entry point of the application. Its primary function is to render the `ImageUploader` component, which handles the main functionality of the app: allowing users to upload an image for food ingredient detection.

**ImageUploader.js**
1. ***`handleFileChange(event)`***
- Handles file selection from the file input.
- Extracts the selected file from the event and logs the file details.
- If a file is selected, creates a URL for the file with `URL.createObjectURL` and updates the component’s `image` and `file` state variables to preview the image.
- **Parameters**: `event` - the file selection event.

2. ***`handleFoodId()`***

- Uploads the selected image to the server for food identification and processes the server response.
- Checks if a file is selected; if not, logs an error and returns.
- Appends the file to a `FormData` object and sends it to the server using `axios.post`.
- Processes the server’s response, which includes:
    - `ingredients`: A list of detected ingredients with their names and bounding box coordinates.
    - `image`: The processed image.
- Creates a dictionary of ingredients with count and bounding box details, updating the component’s `ingredients` state.
- Logs the results and updates the preview with the processed image.
- **Parameters**: None.

3. ***`handleImageLoad(event)`***

- Sets the image’s natural dimensions upon loading, allowing accurate scaling of bounding boxes.
- Extracts the `naturalWidth` and `naturalHeight` of the image from the event.
- Updates the `imageDimensions` state to store these dimensions for use in calculating bounding box positions.
- **Parameters**: `event` - the image load event.

4. ***`generateWikipediaUrl(ingredientName)`***

- Generates a Wikipedia URL for a given ingredient.
- Encodes the `ingredientName` to make it URL-friendly.
- Returns a Wikipedia link formatted with the encoded ingredient name, enabling quick access to more information about the ingredient.
- **Parameters**: `ingredientName` - the name of the ingredient.

5. ***`setHoveredItem(name)`***

- Sets the current ingredient being hovered over in the list to highlight its bounding box in the image.
- Updates the `hoveredItem` state with the provided ingredient name, enabling the display of bounding boxes associated with that ingredient on the image.
- **Parameters**: `name` - the name of the ingredient.

**tailwind.config.js**
- The file is a configuration for Tailwind CSS.
- This file specifies how Tailwind should be applied to the project.

### How To Start Locally
uncomment line 32 and comment out line 33 in `ImageUploader.js`

npm install

npm start

## Middle Point
**Node.js**
- javascript runtime environment for running on a server instead of a browser

### Files
**index.js**
- This file is responsible for creating an `Express` server that processes image uploads from clients, forwards those images to an external service for prediction, and returns the results.

### How To Start Locally
cd node-backend

node index.js

## Backend
**Flask**
- Connect Middlepoint to backend
- Python web framework

**Python**
- high level, object oriented programming language with a large variety of libraries

### Files

**.flaskenv**
- Sets up the flask configurations
- Identifies `FoodIdentifier.py` as the access point for the app

**best.pt**
- checkpoint created from training on custom dataset

**yolov5s.pt**
- original checkpoint

**FoodIdentifier.py**

1. ***findFood()***
- Handles the `/predict` route for food identification.
- Checks if an image file is provided in the request; if not, returns a 400 status with an error message.
- Reads and decodes the image file, converting it from BGR to RGB color space for compatibility with the model.
- If decoding fails, logs an error and returns a 400 status.
- Runs the YOLOv5 model on the image and retrieves predictions.
- Filters predictions based on a confidence threshold (≥ 0.15).
- Draws bounding boxes with labels around detected food items, assigning random colors for visual distinction.
- Encodes the processed image back to its original format and converts it to a base64 string for inclusion in the JSON response.
- Prepares and returns a JSON response containing detected ingredients and the annotated image.
- **Parameters**: None.

2. ***get_separate_colors(name)***

- Generates a unique color for each detected ingredient.
- Checks if a color for the ingredient has already been generated; if not, creates a random RGB color.
- Returns the assigned color, ensuring visual distinction between different ingredient labels in the bounding boxes.
- **Parameters**: `name` - the name of the ingredient.

3. ***model.load()***

- Loads the YOLOv5 model for object detection.
- Utilizes `torch.hub.load` to fetch the specified YOLOv5 model (either `yolov5s.pt` or a custom trained model).
- Makes the model ready for inference on incoming image data.
- **Parameters**: None.

4. ***app.run()***

- Starts the Flask server.
- Listens for incoming requests on the specified port, serving the food detection functionality to clients.
- **Parameters**: None.
  
**processImage.py**
1. **Model Loading**:
- The script begins by importing necessary libraries: `torch` for deep learning, `cv2` for image processing, and `random` for generating unique colors.
- It loads a pre-trained YOLOv5 model from a specified path. The model is capable of detecting various food items within an image.

2. **Image Loading and Preprocessing**:
- The script reads an image file named `insideFridge1.jpg` using OpenCV and converts it from BGR to RGB color space, which is required for processing by the YOLOv5 model.

3. **Object Detection**:
- The model processes the RGB image to identify objects and generate predictions. The results are captured in a DataFrame format, which includes bounding box coordinates and confidence scores for each detected item.

4. **Filtering Predictions**:
- The script filters the predictions to only include items with a confidence score of 0.25 or higher. This helps reduce false positives and focuses on more reliably detected items.

5. **Bounding Box Drawing**:
- A helper function, `get_separate_colors(name)`, generates a unique color for each detected item name, ensuring that bounding boxes are visually distinct.
- The script iterates over the filtered predictions and draws bounding boxes around each detected food item, labeling them with their respective names.

6. **Counting Detected Items**:
- The number of occurrences for each detected food item is counted and displayed in the console for quick reference.

7. **Displaying the Result**:
- Finally, the script uses OpenCV to display the original image with the drawn bounding boxes. It waits for a key press before closing the display window.

### AI Component

**Torch**
- to load in the yolov5 model

**Yolov5**
- the model used

**cv2**
- create bounding boxes

**numpy**
- used to read in image

### How To Start Locally
source myenv/bin/activate

cd myenv

pip install -r requirements

flask run

# Custom Yolov5s
In `FoodIdentifier.py` uncomment the line `model = torch.hub.load("Cruedy/customYolov5", "custom", path="best.pt")` and comment out the line `model = torch.hub.load("Cruedy/customYolov5", "custom", path="yolov5s.pt")`. This will use the `best.pt` checkpoint which was generated using files that I annotated with RoboFlow and a customized `data.yaml` file.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
