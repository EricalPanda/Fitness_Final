import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SubscriptionCheckout.css';

const SubscriptionCheckout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const course = state?.course;

    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [level, setLevel] = useState('');
    const [dayPerWeek, setDayPerWeek] = useState('');
    const [hourPerDay, setHourPerDay] = useState('');
    const [step, setStep] = useState(1);

    const [errors, setErrors] = useState({
        weight: '',
        height: '',
        level: '',
        dayPerWeek: '',
        hourPerDay: '',
    });

    const handleNext = () => {
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const validateFields = () => {
        const newErrors = {};
        if (!weight) newErrors.weight = 'Weight is required.';
        if (!height) newErrors.height = 'Height is required.';
        if (!level) newErrors.level = 'Level is required.';
        if (!dayPerWeek) newErrors.dayPerWeek = 'Days per week is required.';
        if (!hourPerDay) newErrors.hourPerDay = 'Hours per day is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('You need to log in first to proceed with the payment.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/payment', {
                courseId: course._id,
                price: course.price,
                weight,
                height,
                level,
                dayPerWeek,
                hourPerDay,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log(response.data);
            navigate('/');
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
        }
    };

    if (!course) {
        return <div className="not-found">Course not found</div>;
    }

    return (
        <div className="subscription-page">
            <ToastContainer />
            {step === 1 && (
                <div className="step-1">
                    <h1 className="header-title">Confirm Course Information</h1>
                    <div className="course-info">
                        <h2 className="course-name">{course.name}</h2>
                        <div className="course-details">
                            <p><strong>Price:</strong> {course.price} đ</p>
                            <p><strong>Duration:</strong> {course.duration}</p>
                            <p><strong>Coach:</strong> {course.coachId ? (course.coachId.accountId.name || course.coachId._id) : 'No coach assigned'}</p>
                        </div>
                    </div>
                    <button className="next-btn" onClick={handleNext}>Next</button>
                </div>
            )}

            {step === 2 && (
                <div className="step-2">
                    <div className="form-group">
                        <label>Weight (kg):</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                        />
                        {errors.weight && <p className="error-message">{errors.weight}</p>}
                    </div>
                    <div className="form-group">
                        <label>Height (cm):</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            required
                        />
                        {errors.height && <p className="error-message">{errors.height}</p>}
                    </div>
                    <div className="form-group">
                        <label>Level:</label>
                        <input
                            type="text"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            required
                        />
                        {errors.level && <p className="error-message">{errors.level}</p>}
                    </div>
                    <div className="form-group">
                        <label>Days per Week:</label>
                        <input
                            type="text"
                            value={dayPerWeek}
                            onChange={(e) => setDayPerWeek(e.target.value)}
                            required
                        />
                        {errors.dayPerWeek && <p className="error-message">{errors.dayPerWeek}</p>}
                    </div>
                    <div className="form-group">
                        <label>Hours per Day:</label>
                        <input
                            type="text"
                            value={hourPerDay}
                            onChange={(e) => setHourPerDay(e.target.value)}
                            required
                        />
                        {errors.hourPerDay && <p className="error-message">{errors.hourPerDay}</p>}
                    </div>
                    <button className="back-btn" onClick={handleBack}>Back</button>
                    <button className="next-btn" onClick={handlePayment}>Proceed to Payment</button>
                </div>
            )}
        </div>
    );
};

export default SubscriptionCheckout;
