const mongoose = require("mongoose");
const socket = require("socket.io");
require("dotenv").config();

module.exports.initial_route = (req, res) => {
  res.send({
    Project: "Chat App API",
    Framework: "ExpressJS",
    Interpreter: "NodeJS",
    "API Version": "1.0.0",
  });
};

module.exports.connect_to_db = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("🧩 DB connection successfully!");
    })
    .catch(() => {
      console.log("❌ DB connection failed!");
    });
};

module.exports.socket_connect = (server) => {
  try {
    const io = socket(server, {
      cors: {
        origin: "*",
        credentials: true,
      },
    });
    console.log("📡 Socket established!");
    global.onlineUsers = new Map();
    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
      });

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
      });
    });
  } catch (ex) {
    console.log(ex.message);
  }
};
