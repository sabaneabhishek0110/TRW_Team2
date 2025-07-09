// index.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import influxRoutes from './routes/influxRoutes.js'
import { getMachineData } from './services/influxService.js';
import userRoutes from "./routes/user_routes.js";
import { connect } from 'http2';
import connectDB from './config/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true  ,
  methods: ["GET", "POST", "PUT", "DELETE"]           
}));

app.use('/api/influx', influxRoutes);
app.use("/api/user", userRoutes);

const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "http://localhost:5173",  // ✅ Match this
    credentials: true,                // ✅ Important
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const intervals = new Map();

io.on('connection', (socket) => {
  socket.on('machine1-stream', ({ measurement }) => {
    // 🛑 Clear existing interval for this socket
    if (intervals.has(socket.id)) clearInterval(intervals.get(socket.id));

    console.log("Hoin zalo");
    
    const interval = setInterval(async () => {
      const data = await getMachineData(measurement); 
      // console.log(data , "ha ahe backend cha data");
      
      socket.emit("machine1-data", data);
    }, 1000);

    intervals.set(socket.id, interval);
  });

  socket.on('stop-stream', () => {
    if (intervals.has(socket.id)) {
      clearInterval(intervals.get(socket.id));
      intervals.delete(socket.id);
    }
  });

  socket.on('disconnect', () => {
    if (intervals.has(socket.id)) {
      clearInterval(intervals.get(socket.id));
      intervals.delete(socket.id);
    }
    console.log("Client disconnected");
  });
});


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

connectDB();
// team2trwsuns