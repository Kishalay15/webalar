import mongoose, { Error } from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongo_uri = process.env.MONGO_URI;
  if (!mongo_uri) {
    console.error("MongoDB URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongo_uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", (error as Error).message);
    process.exit(1);
  }
};
