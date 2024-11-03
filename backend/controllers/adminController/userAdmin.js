const Account = require("../../models/account");

// Get all accounts
exports.getAllAccounts = async (req, res) => {
    try {
        // Find accounts with role 'user' only
        const accounts = await Account.find({ role: "user" });
        res.json(accounts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


// Create a new account
exports.createAccount = async (req, res) => {
    const { email, password, name, role, status, gender, dob, phone, address } = req.body;

    try {
        let account = await Account.findOne({ email });

        if (account) {
            return res.status(400).json({ msg: "Account already exists" });
        }

        account = new Account({
            email,
            password,
            name,
            role,
            status,
            gender,
            dob,
            phone,
            address,
        });

        await account.save();
        res.json({ msg: "Account created successfully", account });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Update account (role, status, and other fields)
exports.updateAccount = async (req, res) => {
    const { status, gender, dob, phone, address } = req.body;
    const { accountId } = req.params;

    try {
        let account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Account not found" });
        }

        // Update fields if provided
        if (status) account.status = status;
        if (gender) account.gender = gender;
        if (dob) account.dob = dob;
        if (phone) account.phone = phone;
        if (address) account.address = address;

        await account.save();
        res.json({ msg: "Account updated successfully", account });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


// Update user role to coach
exports.UpdateRole = async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(" req.params.id: ", req.params.id);

        res.status(200).json({ msg: 'User role updated successfully', account });
    } catch (err) {
        res.status(500).json({ msg: 'Failed to update user role' });
    }
};

// Block/unblock account
exports.blockUnblockAccount = async (req, res) => {
    const { accountId } = req.params;
    const { status } = req.body; // 'activate' or 'blocked'

    try {
        let account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ msg: "Account not found" });
        }

        account.status = status;

        await account.save();
        res.json({
            msg: `Account ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
            account,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
