const Workout = require("../../models/workout");
const Subscription = require('../../models/subscription');
const moment = require('moment');

exports.getUserSubscriptions = async (req, res) => {
    const userId = req.account.id;

    try {
        const subscriptions = await Subscription.find({ userId }).populate({
            path: 'courseId',
            select: 'name price'
        });

        // Nếu không tìm thấy subscription
        if (!subscriptions.length) {
            return res.status(404).json({ message: 'No subscriptions found for this user' });
        }

        // Trả về danh sách subscriptions của người dùng
        res.status(200).json({ subscriptions });
    } catch (error) {
        console.error('Error fetching user subscriptions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Hàm để lấy subscription và các workout liên quan
exports.getSubscriptionWorkouts = async (req, res) => {
    const { subscriptionId } = req.params;
    const { date } = req.query;

    try {
        const subscription = await Subscription.findById(subscriptionId).populate({
            path: 'workoutId',
            populate: {
                path: 'workout.exerciseId',
                select: 'name'
            }
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        let workouts = subscription.workoutId;
        if (date) {
            const selectedDate = moment(date).startOf('day');
            workouts = workouts.filter(workout =>
                moment(workout.date).isSame(selectedDate, 'day')
            );
        }

        if (!workouts.length) {
            return res.status(404).json({ message: 'No workouts found for the selected date' });
        }

        // Return the workouts
        res.status(200).json({ workouts });
    } catch (error) {
        console.error('Error fetching subscription workouts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


