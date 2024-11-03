import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CoachesList.css';
import { Link } from 'react-router-dom';

const CoachesList = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const coachesPerPage = 3;

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/coaches/');
                setCoaches(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoaches();
    }, []);

    if (loading) return <p>Loading coaches...</p>;
    if (error) return <p>Error: {error}</p>;

    const indexOfLastCoach = currentPage * coachesPerPage;
    const indexOfFirstCoach = indexOfLastCoach - coachesPerPage;
    const currentCoaches = coaches.slice(indexOfFirstCoach, indexOfLastCoach);
    const totalPages = Math.ceil(coaches.length / coachesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getImageSrc = (imageName) => {
        try {
            return require(`../../assets/avatar/${imageName}`);
        } catch (err) {
            return imageName;
        }
    };

    return (
        <div>
            <div className="coaches-list">
                <h1>Coaches</h1>
                <div className="coaches-container">
                    {currentCoaches.map(coach => (
                        <div key={coach._id} className="coach-card">
                            <h2>{coach.accountId?.name || 'Unknown Coach'}</h2> {/* Added optional chaining and default value */}
                            <div className="img-container">
                                <img
                                    src={getImageSrc(coach.accountId?.avatar)}
                                    alt={`${coach.accountId?.name || 'Unknown Coach'}'s profile`}
                                />
                            </div>
                            <p>{coach.introduce}</p>
                            <h3>Experience</h3>
                            <ul>
                                {coach.experience.map((exp, index) => (
                                    <li key={index}>
                                        {exp.time} - {exp.workplace}
                                    </li>
                                ))}
                            </ul>
                            <Link to={`/coach/${coach._id}`}>
                                <button className="details-btn">View Details</button>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="pagination-btn"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoachesList;
