const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Subscription = require('../../models/subscription');
const Schedule = require('../../models/schedule');
const Workout = require('../../models/workout');
// const Progress = require('../../models/');

// Get all subscriptions
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .populate('userId', 'name email')
            .populate('courseId', 'name description');

        if (!subscriptions || subscriptions.length === 0) {
            return res.status(404).json({ message: 'No subscriptions found' });
        }

        res.status(200).json({
            message: 'Subscriptions retrieved successfully',
            data: subscriptions
        });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get a subscription by ID
const getSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        const subscription = await Subscription.findById(subscriptionId)
            .populate('userId', 'name email')
            .populate('courseId', 'name description');

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json({
            message: 'Subscription found',
            data: subscription
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


/*
* @description: This function is used to render a new Schedule
*/

// Create dates 
const generateDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return dates;
};

// Render schedule theo subscription
const generateSchedule = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        // Find the subscription by ID
        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        const { startDate, endDate, startTime, endTime } = subscription;

        const dates = generateDatesBetween(new Date(startDate), new Date(endDate));

        const schedules = dates.map(date => ({
            date: date.toISOString().split('T')[0],
            startTime: {
                hours: startTime.hours,
                minutes: startTime.minutes
            },
            endTime: {
                hours: endTime.hours,
                minutes: endTime.minutes
            },
            subscriptionId: subscription._id,
            workoutId: [],
            progressId: null
        }));

        const savedSchedules = await Schedule.insertMany(schedules);

        res.status(201).json({
            message: 'Schedules generated and saved successfully',
            data: savedSchedules
        });
    } catch (error) {
        console.error('Error generating schedule:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get schedule theo subscription
const getSchedulesUser = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        const schedules = await Schedule.find({ subscriptionId: subscriptionId })
            .populate('workoutId', 'name description')
        // .populate('progressId');

        if (!schedules || schedules.length === 0) {
            return res.status(404).json({ message: 'No schedules found for this subscription' });
        }

        res.status(200).json({
            message: 'Schedules retrieved successfully',
            data: schedules
        });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllSubscriptions,
    getSubscription,
    generateSchedule,
    getSchedulesUser
};
