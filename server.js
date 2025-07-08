import {config} from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user_routes.js";

config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB();