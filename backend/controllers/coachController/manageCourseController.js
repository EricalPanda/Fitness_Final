const Course = require('../../models/course');
const Coach = require('../../models/coach');
const Question = require('../../models/question');
const Option = require('../../models/option');

// Lấy tất cả các khoá học
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('coachId').populate('surveyOptions.questionId').populate('surveyOptions.optionId');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách các khoá học', error });
    }
};

// Lấy một khoá học theo ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('coachId')
            .populate('surveyOptions.questionId')
            .populate('surveyOptions.optionId');
        if (!course) {
            return res.status(404).json({ message: 'Không tìm thấy khoá học' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy khoá học', error });
    }
};

// Tạo khoá học mới
const createCourse = async (req, res) => {
    try {
        const { name, description, duration, price, status, image, difficulty, surveyOptions, coachId } = req.body;

        // Kiểm tra xem coach có tồn tại không
        const coachExists = await Coach.findById(coachId);
        if (!coachExists) {
            return res.status(404).json({ message: 'Không tìm thấy coach' });
        }

        // Kiểm tra surveyOptions
        for (let option of surveyOptions) {
            const question = await Question.findById(option.questionId);
            const optionExists = await Option.findById(option.optionId);
            if (!question || !optionExists) {
                return res.status(404).json({ message: 'Survey option không hợp lệ' });
            }
        }

        const newCourse = new Course({
            name,
            description,
            duration,
            price,
            status,
            image,
            difficulty,
            surveyOptions,
            coachId
        });

        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo khoá học', error });
    }
};

// Cập nhật khoá học
const updateCourse = async (req, res) => {
    try {
        const { name, description, duration, price, status, image, difficulty, surveyOptions, coachId } = req.body;

        // Kiểm tra xem khoá học có tồn tại không
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Không tìm thấy khoá học' });
        }

        // Kiểm tra xem coach có tồn tại không
        const coachExists = await Coach.findById(coachId);
        if (!coachExists) {
            return res.status(404).json({ message: 'Không tìm thấy coach' });
        }

        // Kiểm tra surveyOptions
        for (let option of surveyOptions) {
            const question = await Question.findById(option.questionId);
            const optionExists = await Option.findById(option.optionId);
            if (!question || !optionExists) {
                return res.status(404).json({ message: 'Survey option không hợp lệ' });
            }
        }

        course.name = name;
        course.description = description;
        course.duration = duration;
        course.price = price;
        course.status = status;
        course.image = image;
        course.difficulty = difficulty;
        course.surveyOptions = surveyOptions;
        course.coachId = coachId;

        const updatedCourse = await course.save();
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật khoá học', error });
    }
};

// Xoá khoá học
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Không tìm thấy khoá học' });
        }
        await course.remove();
        res.status(200).json({ message: 'Đã xoá khoá học thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xoá khoá học', error });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};
