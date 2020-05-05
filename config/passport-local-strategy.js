const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        // find a user and establish an identity
        User.findOne({email: email}, function(err, user){
            if(err){
                console.log("Error in finding the user --> Passport");
                return done(err);
            }
            if(!user || user.password != password){
                console.log("Invalid Username/Password");
                return done(null, false);
            }
            return done(null, user);
        });
    }
));
