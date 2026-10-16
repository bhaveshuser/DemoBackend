import mongoose from "mongoose";

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Host is: ${conn.connection.host}`);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1); // Stops the server if database connection fails
    }
}

export default ConnectDB;