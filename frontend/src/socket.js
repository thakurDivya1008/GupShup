import { io } from "socket.io-client";

export const socket = io("http://localhost:7000", {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket', 'polling']
});
