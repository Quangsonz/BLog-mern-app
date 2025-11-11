const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");
var cookieParser = require("cookie-parser");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

//adding socket.io configuration
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const errorHandler = require("./middleware/error");

//import routes
const authRoutes = require("./routes/authRoutes");
const postRoute = require("./routes/postRoute");
const notificationRoutes = require("./routes/notificationRoutes");

//database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

//MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
  })
);
app.use(cookieParser());
app.use(cors());

// prevent SQL injection
app.use(mongoSanitize());
// adding security headers
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  })
);
// prevent Cross-site Scripting XSS
//app.use(xss());
//limit queries per 15mn
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit in development
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later.'
});

// Only apply rate limiting in production or when explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_RATE_LIMIT === 'true') {
  app.use(limiter);
  console.log('✅ Rate limiting enabled');
} else {
  console.log('⚠️ Rate limiting disabled (development mode)');
}
//HTTP Param Pollution
app.use(hpp());

//ROUTES MIDDLEWARE
app.use("/api", authRoutes);
app.use("/api", postRoute);
app.use("/api", notificationRoutes);

__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

//error middleware
app.use(errorHandler);

//port
const port = process.env.PORT || 9000;

// Socket.io events
io.on("connection", (socket) => {
  console.log('User connected:', socket.id);
  
  // Join user's personal notification room
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their notification room`);
  });
  
  socket.on("comment", (msg) => {
    io.emit("new-comment", msg);
  });
  
  // Handle notification events
  socket.on("send-notification", (notification) => {
    io.to(`user-${notification.recipient}`).emit("new-notification", notification);
  });
  
  socket.on("disconnect", () => {
    console.log('User disconnected:', socket.id);
  });
});

// Export io for use in controllers
global.io = io;

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
