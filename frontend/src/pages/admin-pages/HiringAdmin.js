import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HiringAdmin = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admins/hiring-applications');
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications", error);
        }
    };

    const fetchApplicationDetails = async (id) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/admins/hiring-applications/${id}`);
            setSelectedApplication(data);
        } catch (error) {
            console.error("Error fetching application details", error);
        }
    };

    const updateApplicationStatus = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admins/hiring-applications/${id}/status`, { status });
            alert(`Successfully updated status to ${status}`);
            setSelectedApplication(null);
            fetchApplications();
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    return (
        <div>
            <h1>Manage Hiring Applications</h1>

            {/* List of applications */}
            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(app => (
                        <tr key={app._id}>
                            <td>{app.name}</td>
                            <td>{app.email}</td>
                            <td>{app.status}</td>
                            <td>
                                <button onClick={() => fetchApplicationDetails(app._id)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Selected Application Details */}
            {selectedApplication && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Application Details for {selectedApplication.name}</h2>
                    <p>Email: {selectedApplication.email}</p>
                    <p>Status: {selectedApplication.status}</p>

                    {/* Hiring Apply Details */}
                    <h3>Hiring Apply Info</h3>
                    {selectedApplication.hiringApply.map((apply, index) => (
                        <div key={index}>
                            <p>CV: {apply.cvFile}</p>
                            <p>Front ID Card: {apply.frontIDCard}</p>
                            <p>Back ID Card: {apply.backIDCard}</p>
                            <p>Face Photo: {apply.facePhoto}</p>
                            <p>Applied Date: {new Date(apply.date).toLocaleDateString()}</p>
                        </div>
                    ))}

                    {/* Update Status */}
                    <div style={{ marginTop: '20px' }}>
                        <label>
                            Update Status:
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">Select Status</option>
                                <option value="accept">Accept</option>
                                <option value="deny">Deny</option>
                            </select>
                        </label>
                        <button onClick={() => updateApplicationStatus(selectedApplication._id)}>Update Status</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HiringAdmin;
