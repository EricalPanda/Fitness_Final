const Account = require('../../models/account');
const Coach = require('../../models/coach');

// Create new coach
exports.createCoach = async (req, res) => {
    const { accountId, introduce, selfImage, contract, certificate, experience } = req.body;
    try {
        const newCoach = new Coach({ accountId, introduce, selfImage, contract, certificate, experience });
        await newCoach.save();
        res.status(201).json({ msg: 'Coach created successfully', coach: newCoach });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to create coach' });
    }
};

// Get all coaches
exports.getAllCoaches = async (req, res) => {
    try {
        // Lấy tất cả các tài khoản có role là 'coach'
        const accounts = await Account.find({ role: 'coach' });

        // console.log('Accounts:', accounts);

        if (!accounts.length) {
            return res.status(404).json({ msg: 'No coaches found' });
        }

        const coachIds = accounts.map(account => account._id);
        const coaches = await Coach.find({ accountId: { $in: coachIds } }).populate('accountId', 'email name avatar status');

        // console.log('Coaches:', coaches);

        // Tạo mảng chứa thông tin hợp nhất
        const mergedCoaches = coaches.map(coach => {
            const account = accounts.find(acc => acc._id.toString() === coach.accountId._id.toString());
            return {
                _id: coach._id,
                accountId: account._id,
                email: account.email,
                name: account.name,
                status: account.status,
                introduce: coach.introduce,
                selfImage: coach.selfImage,
                contract: coach.contract,
                certificate: coach.certificate,
                experience: coach.experience,
                createdAt: coach.createdAt,
                updatedAt: coach.updatedAt,
            };
        });

        res.status(200).json({ msg: 'Coaches retrieved successfully', coaches: mergedCoaches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to retrieve coaches', error: err.message });
    }
};


// Get coach details by account ID
exports.getCoachById = async (req, res) => {
    const { id } = req.params;
    try {
        const coach = await Coach.findOne({ accountId: id }).populate('accountId');
        if (!coach) {
            return res.status(404).json({ msg: 'Coach not found' });
        }
        res.status(200).json({ msg: 'Coach retrieved successfully', coach });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to retrieve coach' });
    }
};

// Edit coach information 
exports.editCoach = async (req, res) => {
    const { accountId, name, email, avatar, gender, dob, phone, address, introduce, selfImage, contract, certificate, experience } = req.body;

    try {
        const updatedAccount = await Account.findByIdAndUpdate(accountId, {
            name,
            email,
            avatar,
            gender,
            dob,
            phone,
            address
        }, { new: true });

        if (!updatedAccount) {
            return res.status(404).json({ msg: 'Account not found' });
        }

        const updatedCoach = await Coach.findOneAndUpdate({ accountId }, {
            introduce,
            selfImage,
            contract,
            certificate,
            experience
        }, { new: true });

        if (!updatedCoach) {
            return res.status(404).json({ msg: 'Coach not found' });
        }

        res.status(200).json({ msg: 'Coach updated successfully', account: updatedAccount, coach: updatedCoach });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to update coach' });
    }
};


// Block/Unblock coach
exports.blockUnblockCoach = async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ msg: 'Account not found' });
        }

        account.status = account.status === 'activate' ? 'blocked' : 'activate';
        await account.save();

        res.status(200).json({ msg: 'Coach status updated successfully', status: account.status });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to block/unblock coach' });
    }
};

