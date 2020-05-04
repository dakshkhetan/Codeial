const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

// set up static file access (for CSS) 
app.use(express.static('./assets'));

// extract styles and scripts from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// use express layout
app.use(expressLayouts);

// use express router
app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// server:
app.listen(port, function(err){
    if(err){
        // interpolation using back-ticks : ``
        console.log(`Error in setting up server: ${err}`);
    }
    // console.log("Server is up and running on port:", port);
    console.log(`Server is up and running on port: ${port}`);
});