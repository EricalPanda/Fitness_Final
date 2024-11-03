import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SubscriptionDetail.css';

Modal.setAppElement('#root');

function SubscriptionDetail() {
    const { subscriptionId } = useParams();
    const [subscription, setSubscription] = useState(null);
    const [workouts, setWorkouts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);

    const workoutsPerPage = 12;

    useEffect(() => {
        const fetchSubscriptionDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/coaches/subscriptions/${subscriptionId}/workouts`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                const sortedWorkouts = response.data.data.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sắp xếp theo ngày
                setSubscription(response.data.data);
                setWorkouts(sortedWorkouts);
            } catch (error) {
                console.error("Error fetching subscription details:", error);
            }
        };
        fetchSubscriptionDetail();
    }, [subscriptionId]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/coaches/exercises', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setExercises(response.data);
            } catch (error) {
                console.error("Error fetching exercises:", error);
            }
        };
        fetchExercises();
    }, []);

    const lastWorkoutIndex = currentPage * workoutsPerPage;
    const firstWorkoutIndex = lastWorkoutIndex - workoutsPerPage;
    const currentWorkouts = workouts.slice(firstWorkoutIndex, lastWorkoutIndex);

    const totalPages = Math.ceil(workouts.length / workoutsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleEditClick = (workout) => {
        setSelectedWorkout(workout);
        setOpen(true);
        setStep(1);
        setSelectedExercises([]);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedWorkout(null);
        setSelectedExercises([]);
    };

    const handleNextStep = () => {
        if (step === 1) {
            setStep(2);
        } else {
            handleSave();
        }
    };

    const handleBackStep = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleSave = () => {
        // Kiểm tra xem có workout nào khác cùng ngày không
        const isDuplicateDate = workouts.some(workout => {
            return workout.date && new Date(workout.date).toDateString() === new Date(selectedWorkout.date).toDateString() && workout._id !== selectedWorkout._id;
        });

        if (isDuplicateDate) {
            toast.error("A workout already exists for this date.");
            return;
        }

        const updatedWorkout = {
            ...selectedWorkout,
            workout: selectedExercises.map((exercise) => ({
                exerciseId: exercise._id,
                quantity: 1,
            })),
        };

        axios.put(`http://localhost:5000/api/coaches/workouts/${selectedWorkout._id}`, updatedWorkout, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(() => {
                setOpen(false);
                // Cập nhật lại danh sách workout sau khi lưu
                setWorkouts(workouts.map((workout) => workout._id === selectedWorkout._id ? updatedWorkout : workout));
                toast.success("Workout updated successfully!");
            })
            .catch((error) => {
                console.error("Error saving workout:", error);
                toast.error("Error saving workout. Please try again.");
            });
    };

    const handleExerciseSelect = (exercise) => {
        if (selectedExercises.includes(exercise)) {
            setSelectedExercises(selectedExercises.filter((ex) => ex !== exercise));
        } else {
            setSelectedExercises([...selectedExercises, exercise]);
        }
    };

    if (!subscription) {
        return <p>Loading subscription details...</p>;
    }

    return (
        <div className="subscription-detail">
            <h2 style={{ color: "#fff", margin: "0px 0px 25px 25px" }}>Subscription Detail</h2>

            <Link to="/coach/subscription" className="back-link">Back to Subscription List</Link>
            <h3 style={{ color: "#fff", margin: "25px" }}>Workouts</h3>
            <div className="workout-grid">
                {currentWorkouts.map((workout) => (
                    <div key={workout._id} className="workout-card">
                        <h4 className="workout-title">{workout.name}</h4>
                        <p className="workout-detail">Status: {workout.status}</p>
                        <p className="workout-detail">Date: {workout.date ? new Date(workout.date).toLocaleDateString() : "Not Available"}</p>
                        <ul>
                            {workout.workout.map((exercise) => (
                                <li style={{ listStyleType: 'none' }}
                                    key={exercise.exerciseId._id}>
                                    {exercise.exerciseId.name}
                                    <br />
                                    Quantity: {exercise.quantity}
                                </li>
                            ))}
                        </ul>
                        <FaEdit
                            className="edit-icon"
                            onClick={() => handleEditClick(workout)}
                        />
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {/* Modal hiển thị chi tiết bài tập */}
            <Modal
                isOpen={open}
                onRequestClose={handleClose}
                contentLabel="Edit Workout"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                {step === 1 && (
                    <div>
                        <h2 style={{ color: "#121212", margin: "10px 0px 30px 0px" }}>Edit Workout Details</h2>
                        <form>
                            <label style={{ color: "#121212", margin: "10px 0px 30px 0px" }}>
                                Name:
                                <input style={{ margin: '0px 20px' }}
                                    type="text"
                                    value={selectedWorkout?.name || ''}
                                    onChange={(e) => setSelectedWorkout({ ...selectedWorkout, name: e.target.value })}
                                />
                            </label>
                            <label style={{ color: "#121212", margin: "10px 0px 30px 0px" }}>
                                Status:
                                <input style={{ margin: '0px 17px' }}
                                    type="text"
                                    value={selectedWorkout?.status || ''}
                                    onChange={(e) => setSelectedWorkout({ ...selectedWorkout, status: e.target.value })}
                                />
                            </label>
                            <label style={{ color: "#121212", margin: "10px 0px 30px 0px" }}>
                                Date:
                                <input style={{ margin: '0px 10px' }}
                                    type="date"
                                    value={selectedWorkout?.date || ''}
                                    onChange={(e) => setSelectedWorkout({ ...selectedWorkout, date: e.target.value })}
                                />
                            </label>
                            <br />
                            <button type="button" onClick={handleNextStep}>Next</button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 style={{ color: "#121212", margin: "10px 0px 30px 0px" }}>Select Exercises</h2>
                        <ul>
                            {exercises.map((exercise) => (
                                <li style={{ listStyleType: 'none' }}
                                    key={exercise._id}>
                                    <label>
                                        <input style={{ margin: '10px 20px 30px 0px' }}
                                            type="checkbox"
                                            checked={selectedExercises.includes(exercise)}
                                            onChange={() => handleExerciseSelect(exercise)}
                                        />
                                        {exercise.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <button style={{ marginRight: '30px' }}
                            type="button" onClick={handleBackStep}>Back</button>
                        <button type="button" onClick={handleSave}>Save</button>
                    </div>
                )}
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default SubscriptionDetail;
