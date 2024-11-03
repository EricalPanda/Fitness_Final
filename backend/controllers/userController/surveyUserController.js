const Survey = require('../../models/survey');
const Question = require('../../models/question');
const Option = require('../../models/option');

// Lấy khảo sát theo userId kèm theo câu hỏi và tùy chọn
const getSurveyByUserId = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ params (chính là userId)

        // Tìm khảo sát dựa trên userId
        const survey = await Survey.findOne({ userId: id })
            .populate({
                path: 'surveyOptions',
                populate: {
                    path: 'questionId', // Populate the question inside surveyOptions
                }
            });

        if (!survey) return res.status(404).json({ message: 'Survey not found for this user' });

        // Lấy các câu hỏi dựa trên surveyOptions
        const questionIds = survey.surveyOptions.map(option => option.questionId);
        const questions = await Question.find({ _id: { $in: questionIds } })
            .populate('optionId'); // Populate options for each question

        // Kết hợp câu hỏi và tùy chọn lại với nhau
        const questionsWithOptions = questions.map(question => ({
            question: question.question,
            options: question.optionId // This will be the list of options for the question
        }));

        res.status(200).json({ survey, questions: questionsWithOptions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSurveyByUserId
};
