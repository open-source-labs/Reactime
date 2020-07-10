const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname)));

const server = app.listen(3002);
// () => {console.log('Express listening on port 3000');}

module.exports = server;
