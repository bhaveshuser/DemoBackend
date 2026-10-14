import user from "../model/user.js"
import userData from "../model/user.js"
import bcrypt from "bcrypt";
import generateToken from "../utils/jwtUtils.js";
import cloudinary from "../config/cloudinary.js";
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'demoFolder' },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            })
        stream.end(buffer)
    })
}
export const addUser = async (req, res) => {
    try {
        const Password = await bcrypt.hash(req.body.password, 10)
        let imageURL = ""
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer)
            imageURL = result.secure_url
        }
        const userDataValue = {
            name: req.body.name,
            email: req.body.email,
            password: Password,
            image: imageURL
        }
        const saveData = await userData.create(userDataValue)
        res.status(200).json({ data: saveData, message: "Data saved successfully", status: "Success" })
    } catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}
export const getUsers = async (req, res) => {
    try {
        const getUsersData = await userData.find()
        res.status(200).json({ data: getUsersData, message: "Data fetched successfully", status: "Success" })
    } catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}
export const getSingleUser = async (req, res) => {
    try {
        const id = req.params.uid
        const getSingleUserData = await userData.findById(id)
        res.status(200).json({ data: getSingleUserData, message: "Single User Data Fetched successfully", status: "Success" })
    } catch (error) {
        res.status(500).json({ errorMessage: "Response status is 500" })
    }
}
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.uid
        const deletedUser = await userData.findByIdAndDelete(id)
        res.status(200).json({ message: "User Deleted successfully", data: deletedUser })
    } catch (error) {
        res.status(500).json({ errorMessage: "Response status is 500" })
    }
}

export const updateUser = async (req, res) => {
    try {
        // Match this with your backend route parameter
        const id = req.params.uid;
        const existingUser = await userData.findById(id);

        if (!existingUser) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Update only fields that were provided
        if (req.body.name !== undefined) {
            existingUser.name = req.body.name;
        }

        if (req.body.email !== undefined) {
            existingUser.email = req.body.email;
        }

        // Update password only if a new password was provided
        if (req.body.password) {
            existingUser.password = await bcrypt.hash(
                req.body.password,
                10
            );
        }

        // Upload a new image only if selected
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            existingUser.image = result.secure_url;
        }

        const updateUserData = await existingUser.save();

        return res.status(200).json({
            message: 'User Updated Successfully',
            data: updateUserData,
        });
    } catch (error) {
        console.error('Update user error:', error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const uData = await userData.findOne({ email: req.body.email })
        if (!uData) {
            return res.status(200).json({ message: "User not found", status: 0 })
        }
        const passMatch = await bcrypt.compare(req.body.password, uData.password)
        if (passMatch) {
            const token = await generateToken(uData)
            res.status(200).json({ message: "Login Successfull", data: uData, status: 1, token: token })
        }
        res.status(200).json({ message: "Password not match", status: 0 })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}