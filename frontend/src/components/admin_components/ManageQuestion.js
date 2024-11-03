import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionManager = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newOption, setNewOption] = useState('');
    const [editQuestionId, setEditQuestionId] = useState(null);
    const [editOptionId, setEditOptionId] = useState(null);
    const [editQuestionText, setEditQuestionText] = useState('');
    const [editOptionText, setEditOptionText] = useState('');
    const [currentQuestionId, setCurrentQuestionId] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admins/questions');
                setQuestions(response.data);
            } catch (error) {
                toast.error('Lỗi khi tải danh sách câu hỏi');
            }
        };

        fetchQuestions();
    }, []);

    // Thêm câu hỏi mới
    const handleAddQuestion = async () => {
        if (!newQuestion) return;

        try {
            const response = await axios.post('http://localhost:5000/api/admins/questions', { question: newQuestion });
            setQuestions([...questions, response.data]);
            setNewQuestion('');
            toast.success('Thêm câu hỏi thành công!');
        } catch (error) {
            toast.error('Lỗi khi thêm câu hỏi');
        }
    };

    // Sửa câu hỏi
    const handleEditQuestion = async (id) => {
        if (!editQuestionText) return;

        try {
            const response = await axios.put(`http://localhost:5000/api/admins/questions/${id}`, { question: editQuestionText });
            setQuestions(questions.map(q => (q._id === id ? response.data : q)));
            setEditQuestionId(null); // Đóng ô input sau khi chỉnh sửa
            setEditQuestionText('');
            toast.success('Cập nhật câu hỏi thành công!');
            window.location.reload(); // Reload lại trang sau khi cập nhật
        } catch (error) {
            toast.error('Lỗi khi cập nhật câu hỏi');
        }
    };

    // Xóa câu hỏi
    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admins/questions/${id}`);
            setQuestions(questions.filter(q => q._id !== id));
            toast.success('Xóa câu hỏi thành công!');
        } catch (error) {
            toast.error('Lỗi khi xóa câu hỏi');
        }
    };

    // Thêm đáp án mới
    const handleAddOption = async (questionId) => {
        if (!newOption) return;

        try {
            const response = await axios.post(`http://localhost:5000/api/admins/questions/${questionId}/options`, { option: newOption });
            setQuestions(questions.map(q => (q._id === questionId ? { ...q, optionId: [...q.optionId, response.data] } : q)));
            setNewOption('');
            toast.success('Thêm đáp án thành công!');
        } catch (error) {
            toast.error('Lỗi khi thêm đáp án');
        }
    };

    // Sửa đáp án
    const handleEditOption = async (questionId, optionId) => {
        if (!editOptionText) return;

        try {
            const response = await axios.put(`http://localhost:5000/api/admins/questions/${questionId}/options/${optionId}`, { option: editOptionText });
            setQuestions(questions.map(q => {
                if (q._id === questionId) {
                    return {
                        ...q,
                        optionId: q.optionId.map(opt => (opt._id === optionId ? response.data : opt))
                    };
                }
                return q;
            }));
            setEditOptionId(null); // Đóng ô input sau khi chỉnh sửa
            setEditOptionText('');
            toast.success('Cập nhật đáp án thành công!');
            window.location.reload(); // Reload lại trang sau khi cập nhật
        } catch (error) {
            toast.error('Lỗi khi cập nhật đáp án');
        }
    };

    // Xóa đáp án
    const handleDeleteOption = async (questionId, optionId) => {
        try {
            await axios.delete(`http://localhost:5000/api/admins/questions/${questionId}/options/${optionId}`);
            setQuestions(questions.map(q => {
                if (q._id === questionId) {
                    return {
                        ...q,
                        optionId: q.optionId.filter(opt => opt._id !== optionId)
                    };
                }
                return q;
            }));
            toast.success('Xóa đáp án thành công!');
        } catch (error) {
            toast.error('Lỗi khi xóa đáp án');
        }
    };

    return (
        <div>
            <h1>Quản Lý Câu Hỏi</h1>

            {/* Ô input thêm câu hỏi mới */}
            <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Nhập câu hỏi mới"
            />
            <button onClick={handleAddQuestion}>Thêm Câu Hỏi</button>

            <ul>
                {questions.map(q => (
                    <li key={q._id}>
                        {/* Nếu đang sửa câu hỏi này thì hiển thị ô input */}
                        {editQuestionId === q._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editQuestionText}
                                    onChange={(e) => setEditQuestionText(e.target.value)}
                                    placeholder="Sửa câu hỏi"
                                />
                                <button onClick={() => handleEditQuestion(q._id)}>Lưu</button>
                                <button onClick={() => setEditQuestionId(null)}>Hủy</button>
                            </div>
                        ) : (
                            <div>
                                {q.question}
                                <button onClick={() => { setEditQuestionId(q._id); setEditQuestionText(q.question); }}>Sửa</button>
                                <button onClick={() => handleDeleteQuestion(q._id)}>Xóa</button>
                            </div>
                        )}

                        {/* Thêm đáp án cho câu hỏi */}
                        <div>
                            <input
                                type="text"
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                placeholder="Nhập đáp án mới"
                            />
                            <button onClick={() => handleAddOption(q._id)}>Thêm Đáp Án</button>
                        </div>

                        {/* Hiển thị danh sách đáp án */}
                        <ul>
                            {q.optionId.map(opt => (
                                <li key={opt._id}>
                                    {/* Nếu đang sửa đáp án này thì hiển thị ô input */}
                                    {editOptionId === opt._id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editOptionText}
                                                onChange={(e) => setEditOptionText(e.target.value)}
                                                placeholder="Sửa đáp án"
                                            />
                                            <button onClick={() => handleEditOption(q._id, opt._id)}>Lưu</button>
                                            <button onClick={() => setEditOptionId(null)}>Hủy</button>
                                        </div>
                                    ) : (
                                        <div>
                                            {opt.option}
                                            <button onClick={() => { setEditOptionId(opt._id); setEditOptionText(opt.option); }}>Sửa</button>
                                            <button onClick={() => handleDeleteOption(q._id, opt._id)}>Xóa</button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <ToastContainer />
        </div>
    );
};

export default QuestionManager;
