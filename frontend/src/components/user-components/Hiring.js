import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Hiring.css';

const Hiring = () => {
    const [step, setStep] = useState(1);
    const [cv, setCv] = useState(null);
    const [frontId, setFrontId] = useState(null);
    const [backId, setBackId] = useState(null);
    const [facePhoto, setFacePhoto] = useState(null);
    const webcamRef = useRef(null);
    const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setFacePhoto(imageSrc);
        setIsPhotoCaptured(true);
    };

    const handleNextStep = () => {
        if (step === 1 && !cv) {
            toast.error("Please upload your CV before proceeding.");
            return;
        }
        if (step === 2 && (!frontId || !backId)) {
            toast.error("Please upload both front and back ID cards before proceeding.");
            return;
        }
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cv || !frontId || !backId || !facePhoto) {
            toast.error('Please complete all steps before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('cv', cv);
        formData.append('frontId', frontId);
        formData.append('backId', backId);

        // Chuyển ảnh mặt từ base64 sang Blob
        const faceBlob = dataURLtoBlob(facePhoto);
        // formData.append('facePhoto', faceBlob);

        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You must be logged in to apply.');
                return;
            }

            const response = await fetch('http://localhost:5000/api/users/hiringApply', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Application submitted successfully!');
            } else {
                toast.error(data.message || 'Submission failed.');
            }
        } catch (error) {
            toast.error('Error submitting application.');
            console.error('Error:', error);
        }
    };

    const dataURLtoBlob = (dataURL) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    return (
        <div className="coach-hiring-form">
            <h2 style={{ color: '#f36100' }}>Apply to Become a Coach</h2>
            <ToastContainer />

            {step === 1 && (
                <div className="form-step">
                    <h3>Step 1: Upload CV</h3>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setCv)} />
                    <button onClick={handleNextStep}>Next</button>
                </div>
            )}

            {step === 2 && (
                <div className="form-step">
                    <h3>Step 2: Upload Front and Back ID Cards</h3>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFrontId)} />
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBackId)} />
                    <button onClick={handlePreviousStep}>Back</button>
                    <button onClick={handleNextStep}>Next</button>
                </div>
            )}

            {step === 3 && (
                <div className="form-step">
                    <h3>Step 3: Capture Face Photo</h3>
                    {!isPhotoCaptured ? (
                        <>
                            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
                            <button onClick={capturePhoto}>Capture Photo</button>
                        </>
                    ) : (
                        <>
                            <img src={facePhoto} alt="Face" />
                            <button onClick={() => setIsPhotoCaptured(false)}>Retake</button>
                        </>
                    )}
                    <button onClick={handlePreviousStep}>Back</button>
                    <button onClick={handleSubmit}>Submit Application</button>
                </div>
            )}
        </div>
    );
};

export default Hiring;
