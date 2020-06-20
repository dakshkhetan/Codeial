const User = require('../models/user');

// module.exports.actionName = function(req, res){};

// not changing it to async function
// since only one callback function is present here
module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    });
};

module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        // User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email}, function(err, user));
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            req.flash('success', 'Updated!');
            return res.redirect('back');
        });
    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');  // 401 is HTTP Status Code for Unauthorized
    }
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
        req.flash('error', 'Passwords do not match!');
        return res.redirect('back');
    }
    // find user by 'email' parameter/property
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            req.flash('error', 'Error in finding user in signing up.');
            return;
        }
        if(!user){  // if user is not created
            User.create(req.body, function(err, user){
                if(err){
                    req.flash('error', 'Error in creating user while signing up.');
                    return;
                }
                return res.redirect('/users/sign-in');    //url
            })
        } else {    // i.e. user is already created
            req.flash('success', 'You have signed up, login to continue.');
            return res.redirect('back');
        }
    })
};

// sign in and create a session for user
module.exports.createSession = function(req, res){
    req.flash('success', "Logged in successfully.");
    return res.redirect('/');
};

// sign out
module.exports.destorySession = function(req, res){
    req.logout();
    req.flash('success', "You have logged out!");
    return res.redirect('/');
};