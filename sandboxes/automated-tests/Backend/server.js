const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, '../', 'Frontend', 'public')));

const server = app.listen(3000);
// () => {console.log('Express listening on port 3000');}

module.exports = server;
