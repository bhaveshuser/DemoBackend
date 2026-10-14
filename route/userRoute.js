import express from 'express'
import { addUser, getUsers, getSingleUser, deleteUser, updateUser, login } from '../controllers/userDataController.js'
import authenToken from '../utils/authMiddleware.js'
import upload from '../utils/uploadMiddleware.js'
const router = express.Router()
router.post('/api/add-user', authenToken, upload.single('image'), addUser)
router.get('/api/get-users', authenToken, getUsers)
router.get("/api/get-singleuser/:uid", authenToken, getSingleUser)
router.delete("/api/deleteuser/:uid", authenToken, deleteUser)
router.put("/api/updateuser/:uid", authenToken, upload.single('image'), updateUser)
router.post("/api/login", login)
export default router