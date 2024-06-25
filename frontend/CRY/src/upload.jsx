import React from 'react'
import { useState } from "react";
import "./upload.css"
const Upload = () => {
    const [fileInputs, setFileInputs] = useState([{ id: 1, file: null, fileName: "" }]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const handleFileChange = (e, id) => {
        const file = e.target.files[0];
        const newFileInputs = fileInputs.map(input =>
            input.id === id ? { ...input, file, fileName: file.name } : input
        );
        setFileInputs(newFileInputs);
        setFormSubmitted(true);
    };
    const backenduploadfiles=async()=> {
        try{
            const response=await axios.post("",uploadedFiles);
        }
        catch(error){
            console.log(error)
        }
    }
    backenduploadfiles()
    const addFileInput = () => {
        setFileInputs([...fileInputs, { id: fileInputs.length + 1, file: null, fileName: "" }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUploadedFiles = fileInputs
            .filter(input => input.file !== null)
            .map(input => ({
                id: input.id,
                file: input.file,
                fileName: input.fileName,
            }));
        setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
        
    };

    return (
        <div className="container" style={{ color: "5A4A06" }}>
            <h2 style={{ fontFamily: '16px Rubik, sans-serif' }}>Upload Document</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: "30px;" }}>
                {fileInputs.map(input => (
                    <div key={input.id} style={{ marginBottom: '10px' }}>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, input.id)}
                        />
                        
                    </div>
                ))}
                {formSubmitted && (
                    <button type="button" onClick={addFileInput} style={{ marginBottom: '10px', padding: "5px 10px" }}>
                        <span style={{ fontSize: '24px', lineHeight: '1', color: "#5a4a06" }}>+</span>
                    </button>
                )}
                <br />
            
                <button  className="submitbutton"type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Upload;
