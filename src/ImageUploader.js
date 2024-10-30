import './App.css';
import React, {useState} from 'react';
import axios from 'axios';

function ImageUploader() {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

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
        //   const response = await axios.post('http://localhost:3001/upload', formData);
        const response = await axios.post('https://food-id.onrender.com/upload', formData);
          
          console.log('Processing image1...');
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

          console.log('result', result);

          const modifiedResult = {};
          for (const [name, data] of Object.entries(result)) {
              const modifiedName = data.count > 1 ? `${name}s` : name;
              modifiedResult[modifiedName] = data;
          }
          
          console.log('result', modifiedResult);
          console.log('Processing image3...');
          setIngredients(modifiedResult);
          setImage(processedImage);

          console.log('Processed image and ingredients received:', result);
      } catch (error) {
          console.error('Error uploading image:', error);
      }
  };

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  const generateWikipediaUrl = (ingredientName) => {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(ingredientName)}`;
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
                              onLoad={handleImageLoad}
                          />
                      ) : (
                          <h3 className="text-lg font-bold text-center">Image Preview Area</h3>
                      )}
                      {hoveredItem && ingredients[hoveredItem] && ingredients[hoveredItem].bboxes.map((bbox, index) => (
                          <div
                              key={index}
                              style={{
                                  position: 'absolute',
                                  left: (bbox[0] / imageDimensions.width) * 100 + '%',
                                  top: (bbox[1] / imageDimensions.height) * 100 + '%',
                                  width: (bbox[2] - bbox[0]) / imageDimensions.width * 100 + '%',
                                  height: (bbox[3] - bbox[1]) / imageDimensions.height * 100 + '%',
                                  border: '2px solid red',
                                  pointerEvents: 'none'
                              }}
                          />
                      ))}
                  </div>
              </div>
              <div className="w-1/2 h-screen border-2 border-gray-400 bg-gray-200 p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-2">Tip:</h2>
                <p className="mb-2 text-sm text-gray-700">
                    Hover over the items in the list to see which items they're associated with from the fridge.
                    <br />
                    Click on the items in the list to get information on the item.
                </p>
                <div className="flex flex-col items-center h-full ">
                    <h3 className="text-xl font-semibold mb-1">Detected Items</h3>
                    <ul className="w-full">
                        {Object.keys(ingredients).length > 0 ? (
                            Object.entries(ingredients).map(([name, { count }], index) => (
                                <li
                                    key={index}
                                    className="text-center cursor-pointer p-3 mb-2 bg-white rounded-md shadow-sm hover:bg-blue-50 transition duration-200 ease-in-out"
                                    onMouseEnter={() => setHoveredItem(name)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    onClick={() => window.open(generateWikipediaUrl(name), '_blank')}
                                >
                                    <span className="font-medium">{count} {name}</span>
                                </li>
                                
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No items detected.</p>
                        )}
                    </ul>
                </div>
            </div>    
          </div>
      </div>
  );              
}

export default ImageUploader;
