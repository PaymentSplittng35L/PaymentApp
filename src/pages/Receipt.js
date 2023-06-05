import React, { useState } from 'react';
import './Dboard.css'
function Receipt() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Send to srikar
      console.log(selectedFile);
      // You can send the file to a server or process it further
    } else {
      // Handle case where no file is selected
      console.log('No file selected');
    }
  };
  //this should work on iphone but i can't test it lmao
  return (
    <div>
      <h1>Take a Photo and Upload</h1>
      <div>
        <input type="file" accept="image/*" capture="camera" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
}

export default Receipt;