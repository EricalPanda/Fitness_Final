import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SurveyUser.css'; // Tạo file CSS riêng để quản lý giao diện

const Survey = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [goal, setGoal] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admins/questions');
                setQuestions(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleOptionChange = (questionId, optionId) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const handleNextStep = () => {
        if (currentStep < questions.length + 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const surveyOptions = Object.keys(selectedOptions).map((questionId) => ({
            questionId,
            optionId: selectedOptions[questionId],
        }));

        try {
            const response = await axios.post('http://localhost:5000/api/users/survey', {
                height,
                weight,
                goal,
                surveyOptions,
            });
            console.log('Survey saved successfully:', response.data);
            navigate('/');
        } catch (err) {
            console.error('Error saving survey:', err);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="survey-container">
            <form onSubmit={handleSubmit} className="survey-form">
                {currentStep === 0 && (
                    <div className="survey-step">
                        <h2>Personal Information</h2>
                        <div className="input-group">
                            <label>Weight (kg):</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                                className="survey-input"
                            />
                        </div>
                        <div className="input-group">
                            <label>Height (cm):</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                                className="survey-input"
                            />
                        </div>
                        <div className="input-group">
                            <label>Goal:</label>
                            <input
                                type="text"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="Enter your goal"
                                required
                                className="survey-input"
                            />
                        </div>
                    </div>
                )}

                {questions.map((item, index) => (
                    currentStep === index + 1 && (
                        <div key={item._id} className="survey-step">
                            <h4>{item.question}</h4>
                            <ul className="options-list">
                                {item.optionId.map((option) => (
                                    <li key={option._id}>
                                        <label className="option-label">
                                            <input
                                                type="radio"
                                                name={item._id}
                                                value={option._id}
                                                checked={selectedOptions[item._id] === option._id}
                                                onChange={() => handleOptionChange(item._id, option._id)}
                                                className="option-input"
                                            />
                                            {option.option}
                                            {option.image && <img src={option.image} alt={option.option} className="option-image" />}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}

                <div className="navigation-buttons">
                    {currentStep > 0 && (
                        <button type="button" onClick={handlePrevStep} className="prev-button">
                            Previous
                        </button>
                    )}

                    {currentStep < questions.length ? (
                        <button type="button" onClick={handleNextStep} className="next-button">
                            Next
                        </button>
                    ) : (
                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Survey;
