const Account = require("../../models/account");
const Coach = require("../../models/coach");
const bcrypt = require("bcryptjs");

// Get profile user Controller
const getCoachProfile = async (req, res) => {
    try {
        // Tìm tài khoản theo ID
        const user = await Account.findById(req.account.id).where({ role: 'coach' });

        if (!user) {
            return res.status(400).json({ msg: 'User not found or not a coach' });
        }

        // Populate thông tin huấn luyện viên
        const coachProfile = await Coach.findOne({ accountId: user._id })
            .populate('accountId', 'name email phone address gender dob avatar');

        if (!coachProfile) {
            return res.status(400).json({ msg: 'Coach profile not found' });
        }

        // Kết hợp thông tin người dùng và thông tin huấn luyện viên
        const profile = {
            ...user.toObject(),
            coachInfo: coachProfile // Bao gồm coachProfile
        };

        res.status(200).json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Edit coach profile 
const editCoachProfile = async (req, res) => {
    const { name, email, gender, dob, phone, address, experience, introduce, selfImage } = req.body;

    console.log('>>> name:', name, ' - ', '>>> email:', email, ' - ', '>>> gender:', gender, ' - ', '>>> dob:', dob, ' - ', '>>> phone:', phone, ' - ', '>>> address:', address, ' - ', '>>> experience:', experience, ' - ', '>>> introduce:', introduce, ' - ', '>>> selfImage:', selfImage);

    try {
        // Find the user by userId (you should validate the userId before using it)
        const user = await Account.findById(req.account.id);

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ msg: 'User not found' });
        }

        // Update the user profile
        user.name = name;
        user.gender = gender;
        user.address = address || user.address;
        user.phone = phone;
        user.dob = dob;

        // Save the user profile
        await user.save();

        // Find the associated coach profile
        const coachProfile = await Coach.findOne({ accountId: req.account.id });

        if (!coachProfile) {
            console.log('Coach profile not found');
            return res.status(400).json({ msg: 'Coach profile not found' });
        }

        // Update experience, introduce, and selfImage fields in the coach profile
        if (experience) {
            coachProfile.experience = experience;
        }

        if (introduce) {
            coachProfile.introduce = introduce;
        }

        if (selfImage && Array.isArray(selfImage)) {
            coachProfile.selfImage = selfImage;
        }

        // Save the updated coach profile
        await coachProfile.save();
        console.log('Coach profile updated successfully');

        res.status(200).json({ msg: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};




module.exports = {
    getCoachProfile,
    editCoachProfile
};
