import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false // Prevent auto-connect, connect manually in App.jsx
});

export default socket;
