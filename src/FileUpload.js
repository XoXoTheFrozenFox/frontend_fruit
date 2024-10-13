import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import TrackVisibility from 'react-on-screen';
import FallingFruit from './FallingFruit'; // Import the FallingFruit component
import './FileUpload.css'; // Assuming the CSS is in a separate file

const FileUpload = () => {
  const formRef = useRef();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [buttonText, setButtonText] = useState('Upload');
  const [showClassesPopup, setShowClassesPopup] = useState(false); // State for popup visibility
  const [uploadedImage, setUploadedImage] = useState('./coool.jpg'); // Set the initial image path

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    // Create a URL for the uploaded image and update the state
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setUploadedImage(imageUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setButtonText('Uploading...');

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.class) {
        setResult(response.data.class);
        setError(null);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError('Error predicting class: ' + (err.response?.data?.error || err.message));
      setResult(null);
    } finally {
      setButtonText('Upload');
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/classes');
      if (response.data?.classes) {
        setClasses(response.data.classes);
        setError(null);
      } else {
        throw new Error('Failed to fetch classes');
      }
    } catch (err) {
      setError('Error fetching classes: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleShowClassesPopup = () => setShowClassesPopup(true);
  const handleCloseClassesPopup = () => setShowClassesPopup(false);

  return (
    <section className="file-upload">
      <FallingFruit /> {/* Add the FallingFruit component here */}
      <Container>
        <Row className="align-items-center">
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div>
                  <span className="fruit">Fruit Classification</span>

                  {/* Image box to show uploaded image */}
                  <div className="image-box">
                    <img src={uploadedImage} alt="Uploaded" className="uploaded-image" style={{ width: '240px', height: '240px' }} />
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="file-upload-wrapper">
                      <button
                        type="button"
                        className="choose-file-button"
                        onClick={() => document.querySelector('.file-input').click()}
                      >
                        Choose File
                      </button>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="file-input"
                        style={{ display: 'none' }} // Hide the default file input
                      />
                      <label className="file-upload-label">
                        {file ? file.name : 'No File Chosen'}
                      </label>
                      <button type="submit" className="upload-button">
                        <span>{buttonText}</span>
                      </button>
                      <button type="button" className="show-classes-button" onClick={handleShowClassesPopup}>
                        Classes
                      </button>
                    </div>
                  </form>
                  {result && <h2 className="predicted-class">Predicted Class: {result}</h2>}
                  {error && <h2 style={{ color: 'red' }}>{error}</h2>}
                  {/* Popup for displaying available classes */}
                  {showClassesPopup && (
                    <div className="classes-popup">
                      <h4>Available Classes:</h4>
                      <ul>
                        {classes.map((cls, index) => (
                          <li key={index}>{cls}</li>
                        ))}
                      </ul>
                      <button onClick={handleCloseClassesPopup}>Close</button>
                    </div>
                  )}
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FileUpload;  