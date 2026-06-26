import mongoose from "mongoose";
import dns from "dns";

dns.setServers([
    "1.1.1.1",
    "8.8.8.8"
]);

const connectDB = async() =>{
    try{
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
export default connectDB;
