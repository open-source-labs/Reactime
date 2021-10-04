/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname)));

const server = app.listen(5000);

module.exports = server;
