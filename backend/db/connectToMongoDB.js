import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("CONNECTED TO MONGODB");
    //console.log(`CONNECTED TO MONGODB ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`COULD NOT CONNECT TO MONGODB ${error}`);
    process.exit(1);
  }
};
