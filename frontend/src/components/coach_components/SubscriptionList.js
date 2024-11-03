import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import "./SubscriptionList.css";

function SubscriptionList() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/coaches/subscriptions", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                setSubscriptions(response.data.data);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
        };
        fetchSubscriptions();
    }, []);

    // Filter subscriptions based on search term
    const filteredSubscriptions = subscriptions.filter((subscription) =>
        subscription.courseId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="subscription-list-container">
            <h2 className="page-title" style={{ color: "#fff" }}>Subscription List</h2>

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search subscriptions..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="subscription-list">
                {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((subscription) => (
                        <div key={subscription._id} className="subscription-card">
                            <h3 style={{ color: "#fff" }}>{subscription.courseId?.name}</h3>
                            <p><strong>User:</strong> {subscription.userId?.name}</p>
                            <p><strong>Status:</strong> {subscription.subscriptionStatus}</p>
                            <Link to={`/coach/subscription/${subscription._id}`}>
                                <Button variant="primary">View Subscription</Button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No subscriptions found</p>
                )}
            </div>
        </div >
    );
}

export default SubscriptionList;
