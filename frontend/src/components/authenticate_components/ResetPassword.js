import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './ResetPassword.css';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const history = useNavigate();
    const { id, token } = useParams();

    axios.defaults.withCredentials = true;

    // Password validation function
    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordPattern.test(password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isPasswordValid) {
            setMessage('Password must be at least 8 characters long, include at least one lowercase letter, one uppercase letter, and one special character.');
            return;
        }

        setLoading(true);
        axios.post(`http://localhost:5000/api/authenticate/resetpassword/${id}/${token}`, { password })
            .then(res => {
                setLoading(false);
                toast.success('Password updated successfully. Redirecting to login...');
                setTimeout(() => history('/signin'), 3000);
            }).catch(err => {
                setLoading(false);
                setMessage('An error occurred. Please try again.');
                console.log(err);
            });
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setIsPasswordValid(validatePassword(newPassword));
    };

    return (
        <section className="" style={{ margin: '50px' }}>
            <div className="container-fluid">
                <div className="row">
                    <div className="text-black">

                        <div className="d-flex justify-content-center align-items-center">
                            <form style={{ width: '23rem' }} onSubmit={handleSubmit}>
                                <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Reset Password</h3>

                                {message && <div className="alert alert-info">{message}</div>}

                                <div className="form-outline mb-4">
                                    <input
                                        type="password"
                                        placeholder="Enter New Password"
                                        autoComplete="off"
                                        name="password"
                                        className={`form-control form-control-lg ${isPasswordValid ? 'is-valid' : 'is-invalid'}`}
                                        onChange={handlePasswordChange}
                                        value={password}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        {isPasswordValid ? '' : 'Password must be at least 8 characters long, including at least one lowercase letter, one uppercase letter, and one special character.'}
                                    </div>
                                </div>

                                <div className="pt-1 mb-4">
                                    <button type="submit" className="btn btn-success btn-lg btn-block" disabled={loading || !isPasswordValid}>
                                        {loading ? 'Updating...' : 'Update'}
                                    </button>
                                </div>

                                <div className="mt-3 text-center">
                                    <Link to="/signin" className="text-decoration-none">Back to Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
            <ToastContainer /> {/* Add ToastContainer to render toasts */}
        </section>
    );
}

export default ResetPassword;
