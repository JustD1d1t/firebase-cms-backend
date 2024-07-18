import express from "express";
import productRoute from './routes/productRoute.js';
import releaseRoute from './routes/releaseRoute.js';
import attachmentRoute from './routes/attachmentRoute.js';
import galleryRoute from './routes/galleryRoute.js';
import cors from 'cors';

export const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware CORS na początku
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Routes
app.use('/api', productRoute);
app.use('/releases', releaseRoute);
app.use('/attachments', attachmentRoute);
app.use('/gallery', galleryRoute);

app.get("*", function (req, res) {
  res.json({ message: "Request failed" });
});