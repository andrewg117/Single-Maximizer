const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const schedule = require("node-schedule");
const cookieParser = require("cookie-parser");
const { sendScheduledEmail } = require("./controllers/emailController");
const { errorHandler } = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const connectDB = require("./config/db");
const port = process.env.Port || 5000;

connectDB();

const app = express();

// Number of proxies in front of the API (Render's load balancer, plus the static
// site's /api rewrite), so req.ip is the visitor's IP for rate limiting. Never set
// it to true: then anyone could pick their own IP with X-Forwarded-For.
app.set("trust proxy", Number(process.env.TRUST_PROXY) || false);

// Daily function
schedule.scheduleJob({ hour: 12, minute: 0 }, function () {
  sendScheduledEmail();
});

// Before the body parsers, so rejected requests are cheap
app.use("/api", apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set DEBUG_IP=true to check TRUST_PROXY: ip should be your own public IP
if (process.env.DEBUG_IP === "true") {
  app.get("/api/ip", (req, res) => {
    res.json({ ip: req.ip, xff: req.headers["x-forwarded-for"] });
  });
}

app.use("/api/tracks", require("./routes/trackRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/email", require("./routes/emailRoutes"));
app.use("/api/image", require("./routes/imageRoutes"));
app.use("/api/audio", require("./routes/audioRoutes"));
app.use("/api/purchase", require("./routes/purchaseRoutes"));

app.get("/", (req, res) => {
  res.json({ Connection: "Success" });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
