'use strict';

const express = require('express');
const crypto = require('crypto');
const axios = require('axios');


// Constants
const PORT = 8100;
const HOST = '0.0.0.0';

// Code used to generate keys (added to docker-compose.yml)
// const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem'
//   }
// });


// App
const app = express();
app.get('/', async (req, res) => {

  // Caller can set role with query param
  const role = req.query.role ?? 'admin';

  // Create a simple token with signature as auth token
  const privateKey = crypto.createPrivateKey(process.env.CONSUMER_PRIVATE_KEY);
  const signature = crypto.sign(null, Buffer.from(role), privateKey).toString('hex');
  const token = {
    "role": role,
    "sig": signature,
    "exp": new Date(Date.now() + (1000 * 3600)).toISOString()
  }
  
  try {
    const response = await axios.get('http://provider.front:8200/', {
      headers: {'Authorization': JSON.stringify(token)}
    });
    console.log(response.headers);
    const msg = `${response.status} - Consumer called Provider and got response: ${response.data}`;
    console.log(msg);
    res.send(msg);
  } catch (error) {
    console.log(error.response.headers);
    const msg = `${error.response.status} - Consumer called Provider and got response: ${error.response.data}`;
    console.log(msg);
    res.send(msg);
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);