'use strict';

const express = require('express');
const crypto = require('crypto');

// Constants
const PORT = 8300;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {

  // Validate auth token
  const token = JSON.parse(req.header('Authorization'));

  // Verify token signature
  const publicKey = crypto.createPublicKey(process.env.CONSUMER_PUBLIC_KEY);
  const verified = crypto.verify(null, Buffer.from(token.role), publicKey, Buffer.from(token.sig, 'hex'))

  console.log(req.headers);
  console.log(`Provider responded to Consumer '${token.role}'`);

  if (token.role !== 'admin') {
    const err = `Unauthorized request - Invalid role used: ${token.role}`;
    res.status(401).send(err);
    console.log(err);
    return;
  }
  if (!verified) {
    const err = 'Unauthorized - bad token'
    res.status(401).send(err);
    console.log(err);
    return;
  }
  res.send(`Sending resources to Consumer '${token.role}', filter added request header value "${req.header('filter-added')}"`);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);