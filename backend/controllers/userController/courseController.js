const Subscription = require('../../models/subscription');
const Survey = require('../../models/survey');
const Course = require("../../models/course");
const Workout = require("../../models/workout");

const moment = require('moment');

const { v4: uuidv4 } = require('uuid');

// Lấy toàn bộ khóa học
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("coachId", "name")
            .populate("exercises");
        res.status(200).json(courses);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách khóa học", error: error.message });
    }
};

// Lấy chi tiết một khóa học theo ID
exports.getCourseDetail = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId)
            .populate("coachId", "name")
            .populate("exercises");

        if (!course) {
            return res.status(404).json({ message: "Khóa học không tồn tại" });
        }

        res.status(200).json(course); // Trả về thông tin chi tiết khóa học
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết khóa học:", error);
        res.status(500).json({ message: "Lỗi khi lấy chi tiết khóa học", error: error.message });
    }
};



exports.subscriptionPayment = async (req, res) => {
    const { courseId, weight, height, level, dayPerWeek, hourPerDay } = req.body;
    console.log(req.body);

    try {
        // Step 1: Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Step 2: Calculate start and end dates
        const startDate = moment().add(1, 'days').toDate(); // Start date is tomorrow
        const totalSessions = course.slotNumber; // Total number of sessions in the course
        const endDate = moment(startDate).add((totalSessions / dayPerWeek), 'weeks').toDate(); // Calculate end date based on sessions

        // Step 3: Create the subscription record
        const subscription = new Subscription({
            startDate,
            endDate,
            subscriptionStatus: 'active',
            userId: req.account.id,
            courseId: courseId
        });
        await subscription.save();

        // Step 4: Create the survey record
        const survey = new Survey({
            level,
            dayPerWeek,
            hourPerDay,
            height,
            weight
        });
        await survey.save();

        // Step 5: Link the survey with the subscription
        subscription.surveyId = survey._id;
        await subscription.save();

        // Step 6: Generate workout sessions based on the course duration
        const workoutDays = generateWorkoutDays(startDate, dayPerWeek, totalSessions);

        const workoutRecords = workoutDays.map(date => {
            return new Workout({
                name: `${course.name} Workout`,
                date: date,
                status: 'pending',
                workout: [],
                progressId: null,
                workoutVideo: []
            });
        });

        // Save all the workouts in bulk and get the saved documents back
        const savedWorkouts = await Workout.insertMany(workoutRecords);

        // Add the saved workout IDs to the subscription
        subscription.workoutId = savedWorkouts.map(workout => workout._id);
        await subscription.save();

        // Step 7: Respond with success message
        res.status(201).json({
            message: 'Payment successful. Subscription and workouts created.',
            subscriptionId: subscription._id,
            surveyId: survey._id,
            workoutIds: subscription.workoutId
        });

    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Helper function to generate workout dates
const generateWorkoutDays = (startDate, dayPerWeek, totalSessions) => {
    let workoutDays = [];
    let currentDay = moment(startDate);
    let sessionsCreated = 0;

    while (sessionsCreated < totalSessions) {
        for (let i = 0; i < dayPerWeek; i++) {
            if (sessionsCreated >= totalSessions) break;
            workoutDays.push(currentDay.toDate());
            sessionsCreated++;
            currentDay.add(1, 'days');
        }
        currentDay.add(7 - dayPerWeek, 'days');
    }

    return workoutDays;
};




// Thanh toán MoMo
// exports.subscriptionPayment = async (req, res) => {
//     var accessKey = 'F8BBA842ECF85';
//     var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
//     var orderInfo = 'pay with MoMo';
//     var partnerCode = 'MOMO';
//     var redirectUrl = 'http://localhost:5000/api/users/payment-success';
//     var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
//     // var requestType = "captureWallet";
//     var requestType = "payWithCC";
//     var amount = req.body.price || 0;
//     var orderId = `FitZone-${new Date().getTime()}-${uuidv4()}`;
//     var requestId = orderId;
//     var extraData = '';
//     var autoCapture = true;
//     var lang = 'vi';

//     var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

//     const crypto = require('crypto');
//     var signature = crypto.createHmac('sha256', secretKey)
//         .update(rawSignature)
//         .digest('hex');

//     const requestBody = {
//         partnerCode: partnerCode,
//         partnerName: "Test",
//         storeId: "MomoTestStore",
//         requestId: requestId,
//         amount: amount,
//         orderId: orderId,
//         orderInfo: orderInfo,
//         redirectUrl: redirectUrl,
//         ipnUrl: ipnUrl,
//         lang: lang,
//         requestType: requestType,
//         autoCapture: autoCapture,
//         extraData: extraData,
//         signature: signature
//     };

//     const options = {
//         method: 'POST',
//         url: 'https://test-payment.momo.vn/v2/gateway/api/create',
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
//         },
//         data: requestBody
//     };

//     try {
//         const result = await axios(options);
//         const payUrl = result.data.payUrl;
//         console.log("--------------------PAY URL----------------")
//         console.log('>>> payUrl: ', payUrl);
//         res.status(200).json({ payUrl });
//     } catch (error) {
//         return res.status(500).json({
//             STATUS_CODES: 500,
//             message: "server error"
//         });
//     }

// };


// exports.subscriptionPaymentSuccess = async (req, res) => {
//     const { orderId, resultCode, message } = req.query;
//     const email = req.session.email;
//     console.log('>>> email 333: ', email);

//     if (resultCode === '0') {
//         console.log(`Giao dịch thành công. Mã đơn hàng: ${orderId}`);
//         // res.send(`Giao dịch thành công. Mã đơn hàng: ${orderId}`);
//         return res.redirect('http://localhost:3000/course');
//     } else {
//         console.log(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
//         res.send(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
//     }
// };
