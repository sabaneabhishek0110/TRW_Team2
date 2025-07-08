import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import influxRoutes from './routes/influxRoutes.js'
import { getMachineData } from './services/influxService.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
  origin:'*',
  methods : ["GET","POST","PUT","DELETE"]
}))

app.use('/api/influx', influxRoutes);

const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin : '*',
    methods : ["GET","POST","PUT","DELETE"]
  }
});

// Socket connection
io.on('connection', (socket) => {
  socket.on('machine1-stream', (measurement,c) => {
    const interval = setInterval(async () => {
      try {
        const data = await getMachineData(measurement,c); 
        socket.emit('machine1-data', data);
      } catch (err) {
        console.error('Error in machine1-stream:', err.message);
      }
    }, 1000); 

    socket.on('disconnect', () => clearInterval(interval));
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
