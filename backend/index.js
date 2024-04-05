const express = require('express');
const app = express();
const port = 3000; // Change this to your desired port number
const cors = require('cors')

// Middleware
app.use(cors())
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/', require('./routes/index')); // Example route, replace with your actual routes

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
