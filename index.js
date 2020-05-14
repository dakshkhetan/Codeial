const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');   // used for session cookie
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

// helps in reading through the POST request
app.use(express.urlencoded());

app.use(cookieParser());

// set up static file access (for CSS) 
app.use(express.static('./assets'));

// extract styles and scripts from sub-pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// use express layout
app.use(expressLayouts);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'Codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// use express router
app.use('/', require('./routes'));

// server:
app.listen(port, function(err){
    if(err){
        // interpolation using back-ticks : ``
        console.log(`Error in setting up server: ${err}`);
    }
    // console.log("Server is up and running on port:", port);
    console.log(`Server is up and running on port: ${port}`);
});