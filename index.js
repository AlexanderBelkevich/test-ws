import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
  console.log(`listening on port h ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin: "*",
    // origin:
    //   process.env.NODE_ENV === "production" ? false : ["http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // only to user
  socket.emit("message", "Connected!");

  //only all others
  socket.broadcast.emit(
    "message",
    `User ${socket.id.substring(0, 5)} connected`
  );

  // listening for a message emit
  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", `${socket.id.substring(0, 5)}: ${data}`);
  });

  // when user disconnects - to all others
  socket.on("disconnect", () => {
    socket.broadcast.emit(
      "message",
      `User ${socket.id.substring(0, 5)} disconnected`
    );
  });

  // Listen for activity
  socket.on("activity", (name) => {
    socket.broadcast.emit("activity", name);
  });
});
