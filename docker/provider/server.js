'use strict';

const express = require('express');

// Constants
const PORT = 8300;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send(`Sending resources to Consumer, including appended header value "${req.header('x-hello')}"`);
  console.log('Provider responded to Consumer')
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);