const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
//TODO: require { obj } for endpoint root route

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create an instance of Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Parse the request body
// create file path starting with current directory -> dist folder and serve it with express middleware
app.use(express.static(path.join(__dirname, '../dist')));



// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to Digi-Cry Backend!');
  //TODO: add endpoint
});

// Start Sever
app.listen(PORT, () => {
  console.log(`Listening at: http://127.0.0.1:${PORT}`);
});