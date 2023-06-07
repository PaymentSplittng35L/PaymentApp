import React, { useState } from 'react';
import './Dboard.css'
function Receipt() {
    const [selectedFile, setSelectedFile] = useState(null)

    const handleFileChagne = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const handleUpload = () => {
        if (selectedFile) {
            //send to srikar
            console.log(selectedFile);
            //you can send the file to a server or process
        } else {
            //Handle case where no file is selected
            console.log("No file selected");
        }
    }

    //taking pictures on iphone
    return (
        <div>
            <hi>Take a Photo and Upload</hi>
            <div>
                { /*  NOTE THAT IDK WHAT THE NEXT LINE IS BC IT WAS CUT OFF IN THE VID*/}
                <input type="file" accept="image/*" capture="environment"></input> 
                <button onClick={handleUpload}>Upload</button>
            </div>
        </div>
    )

}