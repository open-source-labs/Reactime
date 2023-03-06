/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname)));

// Apple uses port 5000 for Air Play.
const server = app.listen(5001);

module.exports = server;
