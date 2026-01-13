import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import taskRoutes from "./routes/task.route.js"
import reportRoutes from "./routes/report.route.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/reports", reportRoutes)

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})


const PORT = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database connected")

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ DB connection failed", err)
  })
