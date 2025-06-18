import { io } from "socket.io-client";

const socket = io("https://mindmesh-7zpy.onrender.com"); // Adjust if backend is hosted somewhere

export default socket;
