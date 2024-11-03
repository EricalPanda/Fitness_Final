import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './SubscriptionList.css'

const SubscriptionList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscriptions = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get("http://localhost:5000/api/users/subscriptions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setSubscriptions(response.data.subscriptions);
            } catch (err) {
                setError("Error fetching subscriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    // Handle click on "View Schedule"
    const handleViewSchedule = (subscriptionId) => {
        navigate(`/userSchedule/${subscriptionId}`);
    };

    if (loading) return <p>Loading subscriptions...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="subscription-list">
            {subscriptions.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((subscription) => (
                            <tr key={subscription._id}>
                                <td>{subscription.courseId.name}</td>
                                <td>{subscription.courseId.price}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleViewSchedule(subscription._id)}
                                        style={{ backgroundColor: "orange" }}
                                    >
                                        View Schedule
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No subscriptions found.</p>
            )}
        </div>
    );
};

export default SubscriptionList;
