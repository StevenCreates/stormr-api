// These import necessary modules and set some initial variables
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const axios = require('axios')
const convert = require("xml-js");
const rateLimit = require("express-rate-limit");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each IP to 1 requests per windowMs
});

app.use(limiter);

// Allow CORS from any origin
app.use(cors());

// Routes
app.get('/api/account', async (req, res) => {
  try {
  const account = `${req.query.account}`;

  const response = await axios.get(
    `${process.env.ETH_SCAN_API_URL}?module=account&action=tokentx&address=${account}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.ETH_SCAN_API_KEY}`,
  );
  const results = response.data.result
  res.send(response.data.result)
  return res.json({
    success: true,
    results
  })
} catch (err) {
  return res.status(500).json({
    success: false,
    message: err.message,
  });
}
});

// This spins up our sever and generates logs for us to use.
// Any console.log statements you use in node for debugging will show up in your
// terminal, not in the browser console!
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
