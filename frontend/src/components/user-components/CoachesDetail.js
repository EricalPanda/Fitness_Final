import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CoachesDetail.css';

const CoachDetails = () => {
    const { id } = useParams();
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoach = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/coaches/${id}`);
                setCoach(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoach();
    }, [id]);

    if (loading) return <p>Loading coach details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!coach) return <p>Coach not found</p>;

    // Using optional chaining to handle potential null values
    const { accountId, introduce, experience } = coach || {};
    const { name, gender, dob, address, avatar } = accountId || {};

    const handleBack = () => {
        navigate('/coach-details');
    };

    const getImageSrc = (imageName) => {
        try {
            return require(`../../assets/avatar/${imageName}`);
        } catch (err) {
            return imageName;
        }
    };

    return (
        <div className="coach-details">
            <button className="back-btn" onClick={handleBack}> &larr; Back
            </button>

            {/* Safely checking accountId and name */}
            {accountId ? (
                <>
                    <h1>{name}'s Profile</h1>

                    <div className="account-info">
                        <div className="img-container">
                            <img src={getImageSrc(avatar)} alt={`${name}'s profile`} />
                        </div>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Gender:</strong> {gender ? "Male" : "Female"}</p>
                        <p><strong>Date of Birth:</strong> {dob ? new Date(dob).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Address:</strong> {address || 'N/A'}</p>
                    </div>
                </>
            ) : (
                <p>No account information available.</p>
            )}

            <div className="coach-info">
                <h3>Introduction</h3>
                <ReactQuill value={introduce || ''} readOnly={true} theme="bubble" />
            </div>

            <div className="coach-experience">
                <h3>Experience</h3>
                <ul>
                    {experience?.length ? (
                        experience.map((exp, index) => (
                            <li key={index}>
                                {exp.time} - {exp.workplace}
                            </li>
                        ))
                    ) : (
                        <li>No experience listed</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CoachDetails;
