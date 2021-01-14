const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const contactRouter = require('./contact/contactRoutes');

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const PORT = process.env.PORT || 8080;
const MONGO_URL = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.ihyfi.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
let server;

start();

function start() {
  initServer();
  initMiddlewares();
  initRoutes();
  connectDatabase();
  listen();
}

function initServer() {
  server = express();
}

function initMiddlewares() {
  server.use(express.json());
  server.use(cors({ origin: 'http://localhost:8080' }));
  server.use(morgan('dev'));
}

function initRoutes() {
  server.use('/api/contacts', userRouter);
}

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('Database connection successful');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

function listen() {
  server.listen(PORT, () => {
    console.log('Server is listening on port: ', PORT);
  });
}

