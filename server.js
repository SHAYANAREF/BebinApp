import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("modelPosition", (data) => {
    io.emit("modelPositionUpdate", data);
  });
  socket.on("locationUpdate", (location) => {
    io.emit("locationUpdate", { id: socket.id, location });
  });
});

server.listen(60678, () => console.log("Socket.io server on port 60678"));
