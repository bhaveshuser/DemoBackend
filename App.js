import express from "express";
import cors from 'cors';
import 'dotenv/config';
import ConnectDB from "./config/db.js";
import router from "./route/userRoute.js";
const app = express()
// app.use(cors({
//     origin: 'https://demofrontend-6dshk84d8-any-team1.vercel.app', // Replace with your actual Vercel frontend URL (no trailing slash)
//     credentials: true
// }));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
const PORT = process.env.PORT
app.get('/', (req, res) => {
    res.send("API is running")
});
ConnectDB().then(() => {
    app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`));
})