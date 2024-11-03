const Account = require('../../models/account');
const cloudinary = require('../../utils/cloudinary')
const upload = require('../../middleware/multer')
const { uploadToCloudinary } = require('../../utils/cloudinary');

// Controller function to handle hiring apply
const userHiringApply = async (req, res) => {
    try {
        const { cv, frontId, backId } = req.files;
        const accountId = req.account.id;

        console.log(">>> accountId: ", accountId);

        console.log('>>> cv, frontId, backId, facePhoto: ', cv, frontId, backId);

        // Upload từng file lên Cloudinary và lấy URL
        const cvUrl = await uploadToCloudinary(cv[0].buffer, 'hiring/cv');
        const frontIdUrl = await uploadToCloudinary(frontId[0].buffer, 'hiring/idcards');
        const backIdUrl = await uploadToCloudinary(backId[0].buffer, 'hiring/idcards');
        // const facePhotoUrl = await uploadToCloudinary(facePhoto[0].buffer, 'hiring/facephotos');
        const facePhotoUrl = '1111'

        // Tạo dữ liệu cần lưu vào DBs
        const hiringData = {
            cvFile: cvUrl,
            frontIDCard: frontIdUrl,
            backIDCard: backIdUrl,
            facePhoto: facePhotoUrl,
            date: new Date(),
            status: 'pending',
        };

        // Tìm account theo ID và thêm dữ liệu vào trường hiringApply
        const account = await Account.findByIdAndUpdate(
            accountId,
            { $push: { hiringApply: hiringData } },
            { new: true, useFindAndModify: false }
        );

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json({ message: 'Application submitted successfully', hiringData });
    } catch (error) {
        console.error('Error during file upload or database operation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    userHiringApply
};
