const User = require('../models/user');

// module.exports.actionName = function(req, res){};

module.exports.profile = function(req, res){
    // return res.end('<h1> User Profile page! </h1>');
    return res.render('user_profile', {
        title: "User Profile"
    });
};

// render the sign up page
module.exports.signUp = function(req, res){

    // if user is already signed in, then redirect to profile page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
};

// render the sign in page
module.exports.signIn = function(req, res){

    // if user is already signed in, then redirect to profile page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
};

// get the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    // find user by 'email' parameter/property
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding user in signing up.');
            return;
        }
        if(!user){  // if user is not created
            User.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user while signing up.');
                    return;
                }
                return res.redirect('/users/sign-in');    //url
            })
        } else {    // i.e. user is already created
            return res.redirect('back');
        }
    })
};

// sign in and create a session for user
module.exports.createSession = function(req, res){
    return res.redirect('/');
};
