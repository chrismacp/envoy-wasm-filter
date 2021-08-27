'use strict';

const express = require('express');
const http = require('http');
const axios = require('axios');

// Constants
const PORT = 8100;
const HOST = '0.0.0.0';


// App
const app = express();
app.get('/', (req, res) => {
  // Make a request to the Provider Service via the proxy
  axios.get('http://provider.front:8200/')
    .then(function (response) {
      // handle success
      console.log(response.headers);
      res.send(`Made a request to the Provider service and received:\n\n
                Response: ${response.data}\n\n
                Consumer received response header ('filter-added'): ${response.headers['filter-added']}`);
    })
    .catch(function (error) {
      // handle error
      res.status(500).send(`Made a request to the Provider service, but it failed:\n\n${error}`);
    })
    .then(function () {
      // always executed
      console.log("Consumer called Provider");
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);