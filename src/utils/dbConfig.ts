import mongoose from "mongoose";
import "dotenv/config";

const connect = async () => {
    const connection = mongoose.connection.readyState;
    if (connection === 1) {
        console.log("Already connected to database");
        return;
    }
    if (connection === 2) {
        console.log("Connecting to database");
        return;
    }

    try {
        mongoose.connect(process.env.MONGO_URI as string, {
            bufferCommands: true,
        });

        mongoose.connection.on("connected", () => {
            console.log("Connected to database");
        });
    } catch (error: any) {
        console.error("Error connecting to database: ", error.message);
    }
};

export default connect;
