const express = require("express");
const cors = require("cors");
const authRoutes = require("../routes/auth");
const messageRoutes = require("../routes/messages");
const app = express();
const { connect_to_db, socket_connect, initial_route } = require("./config");

require("dotenv").config();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.get("/", initial_route);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start Server
const server = app.listen(process.env.PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${process.env.PORT}`)
);

// Connect to DB
connect_to_db();
// Create Web Socket
socket_connect(server);

module.exports = app;
