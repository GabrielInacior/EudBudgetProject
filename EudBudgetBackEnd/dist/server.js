"use strict";
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const winston = require('winston');
const morgan = require('morgan');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Configure Winston for logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ],
});

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

const manifestPath = path.join(__dirname, '..', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.routes.forEach((route) => {
  const controller = require(`./Controller/${route.controller}`);
  app[route.method.toLowerCase()](
    route.path,
    (req, res) => {
      logger.info(`Route called: ${route.method} ${route.path}`);
      controller[route.action](req, res);
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Erro:', err.message);
  res.status(500).send('Ocorreu um erro no servidor.');
});


const PORT = process.env.PORT || 5000;
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});