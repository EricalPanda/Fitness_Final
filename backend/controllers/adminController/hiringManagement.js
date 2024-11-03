const Account = require('../../models/account');

// Lấy danh sách tất cả các hồ sơ tuyển dụng
const getAllHiringApplications = async (req, res) => {
    try {
        const accounts = await Account.find({ 'hiringApply.0': { $exists: true } }).select('name email hiringApply status');
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách ứng tuyển.", error });
    }
};

// Lấy thông tin chi tiết hồ sơ tuyển dụng 
const getHiringApplicationById = async (req, res) => {
    const accountId = req.params.id;

    try {
        const account = await Account.findById(accountId).select('name email hiringApply status');
        if (!account) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin ứng tuyển.", error });
    }
};

// Cập nhật trạng thái ứng tuyển (status)
const updateHiringApplicationStatus = async (req, res) => {
    const accountId = req.params.id;
    const { status } = req.body; // "accept" hoặc "deny"

    if (status !== "accept" && status !== "deny") {
        return res.status(400).json({ message: "Trạng thái không hợp lệ. Chỉ có thể là 'accept' hoặc 'deny'." });
    }

    try {
        const account = await Account.findById(accountId);

        if (!account || !account.hiringApply.length) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ ứng tuyển." });
        }

        // Cập nhật status cho tài khoản
        account.status = status;
        await account.save();

        res.status(200).json({ message: `Cập nhật trạng thái thành công: ${status}`, account });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái.", error });
    }
};

module.exports = {
    getAllHiringApplications,
    getHiringApplicationById,
    updateHiringApplicationStatus
};
