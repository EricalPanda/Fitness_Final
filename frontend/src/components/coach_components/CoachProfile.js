import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchCoachProfile } from '../../services/coachService';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import './CoachProfile.css';

const CoachProfile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [hasPassword, setHasPassword] = useState(true);
    const [isEditing, setIsEditing] = useState(true);

    // Experience and additional fields (selfImage, introduce)
    const [experience, setExperience] = useState([{ time: '', workplace: '' }]);
    const [introduce, setIntroduce] = useState('');
    const [selfImage, setSelfImage] = useState(['']);

    // Tab switching
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await fetchCoachProfile();
                setLoading(false);
                setProfile(data);

                setName(data.name);
                setEmail(data.email);
                setGender(data.gender);
                setDob(data.dob);
                setPhone(data.phone);
                setAddress(data.address);

                if (data.coachInfo && data.coachInfo.experience) {
                    setExperience(data.coachInfo.experience);
                } else {
                    setExperience([{ time: '', workplace: '' }]);
                }

                setIntroduce(data.introduce || '');
                setSelfImage(data.selfImage || ['']);
                setHasPassword(data.password);
            } catch (error) {
                setError(error.message);
                setLoading(false);
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    // Edit profile
    const handleEditProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                'http://localhost:5000/api/coaches/editCoachProfile',
                { name, email, gender, dob, phone, address, experience, introduce, selfImage },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    // Change password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            await axios.put(
                'http://localhost:5000/api/users/changePassword',
                {
                    currentPassword: hasPassword ? currentPassword : '',
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Error: ' + error.message);
        }
    };

    // Experience handlers
    const handleExperienceChange = (index, field, value) => {
        const updatedExperience = [...experience];
        updatedExperience[index][field] = value;
        setExperience(updatedExperience);
    };

    const handleAddExperience = () => {
        setExperience([...experience, { time: '', workplace: '' }]);
    };

    const handleRemoveExperience = (index) => {
        const updatedExperience = experience.filter((_, i) => i !== index);
        setExperience(updatedExperience);
    };

    // Self Image handlers
    const handleSelfImageChange = (index, value) => {
        const updatedSelfImage = [...selfImage];
        updatedSelfImage[index] = value;
        setSelfImage(updatedSelfImage);
    };

    const handleAddSelfImage = () => {
        setSelfImage([...selfImage, '']);
    };

    const handleRemoveSelfImage = (index) => {
        const updatedSelfImage = selfImage.filter((_, i) => i !== index);
        setSelfImage(updatedSelfImage);
    };

    if (loading) return <div id="preloder"><div className="loader"></div></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="main-content">
            <ToastContainer />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body text-center">
                                <img
                                    src="https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg"
                                    className="rounded-circle mb-3"
                                    alt="Profile"
                                    style={{ width: '150px' }}
                                />
                                <h5 className="card-title">{profile && profile.name}</h5>
                            </div>
                        </div>
                        {/* Change Password */}
                        <div className="card shadow mt-4">
                            <div className="card-body">
                                <h5 className="card-title">Change Password</h5>
                                <form onSubmit={handleChangePassword}>
                                    {hasPassword && (
                                        <div className="form-group">
                                            <label>Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                required
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-info btn-block">Save Change</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        {/* Tabs Navigation */}
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                    href="#profile"
                                    onClick={() => handleTabClick('profile')}
                                >
                                    Edit Profile
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'experience' ? 'active' : ''}`}
                                    href="#experience"
                                    onClick={() => handleTabClick('experience')}
                                >
                                    Edit Experience
                                </a>
                            </li>
                        </ul>

                        <div className="tab-content">
                            {/* Edit Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="tab-pane fade show active" id="profile">
                                    <div className="card shadow mt-3">
                                        <div className="card-body">
                                            <form onSubmit={handleEditProfile}>
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        value={email}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Full Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        readOnly={!isEditing}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Gender</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={gender}
                                                        onChange={(e) => setGender(e.target.value)}
                                                        readOnly={!isEditing}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Date of Birth</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={dob}
                                                        onChange={(e) => setDob(e.target.value)}
                                                        readOnly={!isEditing}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Phone Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        readOnly={!isEditing}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={address}
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        readOnly={!isEditing}
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-info btn-block">Save</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Edit Experience Tab */}
                            {activeTab === 'experience' && (
                                <div className="tab-pane fade show active" id="experience">
                                    <div className="card shadow mt-3">
                                        <div className="card-body">
                                            <div className="form-group">
                                                <label>Introduce</label>
                                                {isEditing ? (
                                                    <ReactQuill
                                                        value={introduce}
                                                        onChange={setIntroduce}
                                                        theme="snow"
                                                    />
                                                ) : (
                                                    <div
                                                        className="form-control"
                                                        style={{ whiteSpace: 'pre-wrap' }}
                                                        dangerouslySetInnerHTML={{ __html: introduce }}
                                                    />
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <label>Experience</label>
                                                {experience.map((exp, index) => (
                                                    <div key={index} className="mb-2">
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Time"
                                                                    value={exp.time}
                                                                    onChange={(e) =>
                                                                        handleExperienceChange(index, 'time', e.target.value)
                                                                    }
                                                                    readOnly={!isEditing}
                                                                />
                                                            </div>
                                                            <div className="col-md-5">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Workplace"
                                                                    value={exp.workplace}
                                                                    onChange={(e) =>
                                                                        handleExperienceChange(index, 'workplace', e.target.value)
                                                                    }
                                                                    readOnly={!isEditing}
                                                                />
                                                            </div>
                                                            {isEditing && (
                                                                <div className="col-md-2">
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => handleRemoveExperience(index)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {isEditing && (
                                                    <button className="btn btn-success" onClick={handleAddExperience}>
                                                        <FontAwesomeIcon icon={faPlus} /> Add Experience
                                                    </button>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label>Self Images</label>
                                                {selfImage.map((image, index) => (
                                                    <div key={index} className="mb-2">
                                                        <div className="row">
                                                            <div className="col-md-10">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Image URL"
                                                                    value={image}
                                                                    onChange={(e) =>
                                                                        handleSelfImageChange(index, e.target.value)
                                                                    }
                                                                    readOnly={!isEditing}
                                                                />
                                                            </div>
                                                            {isEditing && (
                                                                <div className="col-md-2">
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => handleRemoveSelfImage(index)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {isEditing && (
                                                    <button className="btn btn-success" onClick={handleAddSelfImage}>
                                                        <FontAwesomeIcon icon={faPlus} /> Add Image
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachProfile;
