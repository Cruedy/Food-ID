import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import axios from 'axios';
import { type } from '@testing-library/user-event/dist/type';

function ImageUploader() {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [renderedDimensions, setRenderedDimensions] = useState({ width: 0, height: 0 });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log('File selected:', file);
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(imageURL);
            setFile(file);
        }
    };

    const handleFoodId = async () => {
      if (!file) {
          console.error('No file selected');
          return;
      }
      const formData = new FormData();
      formData.append('image', file);

      try {
          console.log('Processing image...');
          const response = await axios.post('/backend/route', formData);
          
          const { ingredients: detectedIngredients, image: processedImage } = response.data;
          console.log('Processing image2...');
          // Update the image and ingredients state
          const result = detectedIngredients.reduce((acc, item) => {
              if (!acc[item.name]) {
                  acc[item.name] = {
                      count: 0,
                      bboxes: [] // Array to store all bounding boxes for this item
                  };
              }
              acc[item.name].count += 1;
              acc[item.name].bboxes.push([item.xmin, item.ymin, item.xmax, item.ymax]); // Store bounding box
              return acc;
          }, {});
          console.log('Processing image3...');
          setIngredients(result);
          setImage(processedImage);

          console.log('Processed image and ingredients received:', result);
      } catch (error) {
          console.error('Error uploading image:', error);
      }
  };

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target; // Get original image dimensions
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
    setRenderedDimensions({ width: event.target.clientWidth, height: event.target.clientHeight });
  };

  const calculateScaleFactors = () => {
      const widthScale = renderedDimensions.width / imageDimensions.width;
      const heightScale = renderedDimensions.height / imageDimensions.height;
      return { widthScale, heightScale };
  };
    
  return (
      <div className="flex flex-col items-center justify-center mt-10">
          <h2 className="text-2xl font-bold mb-4">Add Image:</h2>
          <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="mb-4 border border-gray-300 p-2 rounded-lg"
          />
          <button className="mb-4 border border-gray-300 p-2 rounded-lg" onClick={handleFoodId}>
              Identify Food
          </button>
          <div className="flex min-w-full">
              <div className="relative w-1/2 h-screen border-2 border-gray-400 bg-gray-200">
                  <div className="flex flex-col justify-center items-center h-full">
                      {image ? (
                          <img 
                              src={image} 
                              alt="Processed preview" 
                              className="w-full h-full object-contain"
                              onLoad={handleImageLoad} // Handle load event to get dimensions
                          />
                      ) : (
                          <h3 className="text-lg font-bold text-center">Image Preview Area</h3>
                      )}
                      {/* Render multiple bounding boxes for hovered items */}
                      {hoveredItem && ingredients[hoveredItem] && ingredients[hoveredItem].bboxes.map((bbox, index) => (
                          <div
                              key={index}
                              style={{
                                  position: 'absolute',
                                  left: (bbox[0] / imageDimensions.width) * 100 + '%', // Adjust for scale
                                  top: (bbox[1] / imageDimensions.height) * 100 + '%', // Adjust for scale
                                  width: (bbox[2] - bbox[0]) / imageDimensions.width * 100 + '%', // Adjust for scale
                                  height: (bbox[3] - bbox[1]) / imageDimensions.height * 100 + '%', // Adjust for scale
                                  border: '2px solid red',
                                  pointerEvents: 'none' // Allow clicking through this div
                              }}
                          />
                      ))}
                  </div>
              </div>
              <div className="w-1/2 h-screen border-2 border-gray-400 bg-gray-200">
                  <div className="flex flex-col justify-center items-center h-full">
                      <h3 className="text-lg font-bold">Detected Items:</h3>
                      <ul>
                          {Object.keys(ingredients).length > 0 ? (
                              Object.entries(ingredients).map(([name, { count }], index) => (
                                  <li
                                      key={index}
                                      className="text-center"
                                      onMouseEnter={() => setHoveredItem(name)} // Set hovered item on mouse enter
                                      onMouseLeave={() => setHoveredItem(null)} // Clear hovered item on mouse leave
                                  >
                                      {count} {name}
                                  </li>
                              ))
                          ) : (
                              <p>No items detected.</p>
                          )}
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  );             
}

export default ImageUploader;
