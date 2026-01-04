import mongoose from "mongoose";

// Connect MongoDB
export const connectDb = async () => {
  const mongoUsername = "ammarmd50";
  const mongoPassword = "pcS5YKiQJMa0O3Ep";
  const dbname = "mydb";
  const mongoUri = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.iuyjrlw.mongodb.net/${dbname}?appName=Cluster0`;
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
