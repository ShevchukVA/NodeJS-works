const express = require('express');
const cors = require('cors');
const contactRouter = require('./contact/contactRoutes');
const morgan = require('morgan');
const PORT = 8080;

class ContactServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer(),
      this.initMiddlewares(),
      this.initRoutes(),
      this.startListening();
  }

  initServer() {
    this.server = express();
  }
  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan('dev'));
    this.server.use(cors({ origin: 'http://localhost:8080' }));
  }
  initRoutes() {
    this.server.use('/api/contacts', contactRouter);
  }
  startListening() {
    this.server.listen(PORT, () => {
      console.log('Server is listening on Port', PORT);
    });
  }
}

const server = new ContactServer();
server.start();
