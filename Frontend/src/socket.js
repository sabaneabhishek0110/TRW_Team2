import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ['websocket'], // optional
  autoConnect: true,         // or false if you connect manually
});

export default socket;