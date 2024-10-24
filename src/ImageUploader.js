import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';

function ImageUploader() {
    const [image, setImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log('File selected:', file);
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(imageURL);
        }
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
          <div className="flex min-w-full">
            {/* Add a background color for debugging */}
            <div className="w-1/2 h-screen border-2 border-gray-400 bg-gray-200">
              <div className="flex flex-col justify-center items-center h-full">
                {image ? (
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <h3 className="text-lg font-bold text-center">Image Preview Area</h3>
                )}
              </div>
            </div>
            {/* Add a background color for debugging */}
            <div className="w-1/2 h-screen border-2 border-gray-400 bg-gray-200">
              <div className="flex flex-col justify-center items-center h-full">
                <p>Item ID</p>
              </div>
            </div>
          </div>
        </div>
      );            
}

export default ImageUploader;
