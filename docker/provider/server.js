'use strict';

const express = require('express');

// Constants
const PORT = 8300;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send(`Sending resources to Consumer, filter added request header value "${req.header('filter-added')}"`);
  console.log(`Provider received request header "filter-added" with value "${req.header('filter-added')}"`)
  console.log('Provider responded to Consumer')
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);