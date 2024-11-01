import mongoose from "mongoose";

// MongoDB connection string
const mongoURI: string = `mongodb+srv://jata1518:${process.env.MONGO_DB_PASSWORD}@community.sqa2w.mongodb.net/community`;

// Function to connect to MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectMongoDB;
