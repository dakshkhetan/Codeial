// require the library
const mongoose = require('mongoose');

const env = require('./environment');

// connect to the database
mongoose.connect(`mongodb://localhost/${env.db}`);

// acquire the connection (to check if it is successful)
const db = mongoose.connection;

// error
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

// up and running, then print the message
db.once('open', function () {
  console.log('Connected to Database :: MongoDB');
});

module.exports = db;
