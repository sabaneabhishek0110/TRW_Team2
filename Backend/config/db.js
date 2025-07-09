import mongoose from "mongoose";

const connectDB = (req, res) => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "contactMessenger",
    })
    .then(() => console.log("database is connected"))
    .catch((e) => console.log(e));
};

export default connectDB;