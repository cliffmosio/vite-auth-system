//backend/server.js
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
console.log("✅ Allowed Origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌍 Incoming Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // allow the origin
    } else {
      callback(new Error('❌ Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));


// Routes
app.use('/api/auth', authRoutes);
console.log("🚀 Auth routes registered successfully");

const PORT = process.env.PORT || 5004;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Failed to start server due to MongoDB error:', err.message || err);
    process.exit(1);
  });
