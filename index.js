const express = require('express');
const app = express();
const port = 8000;

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        // interpolation using back-ticks : ``
        console.log(`Error in setting up server: ${err}`);
    }
    // console.log("Server is up and running on port:", port);
    console.log(`Server is up and running on port: ${port}`);
});