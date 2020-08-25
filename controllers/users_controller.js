const User = require('../models/user');
const fs = require('fs'); // file system (for I/O operations)
const path = require('path');

// module.exports.actionName = function(req, res){};

// not changing it to async function
// since only one callback function is present here
module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    return res.render('user_profile', {
      title: 'User Profile',
      profile_user: user
    });
  });
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      // we need to first find and then update the user's profile record

      let user = await User.findById(req.params.id);

      // now, we cannot use req.body params in the form to fetch new/updated user data
      // hence, we'll need to use the static method/function 'uploadedAvatar' to use req params
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log('Multer Error: ', err);
        }

        // updating user data
        user.name = req.body.name;
        user.email = req.body.email;

        // avatar will be set only when a file is uploaded i.e. when request contains a file
        if (req.file) {
          // console.log(req.file);

          // TODO: edit the below if condition in order to handle
          // the case when all avatar files are deleted

          // to delete previous avatar file uploads
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }

          // saving the path of uploaded file into the avatar field in the 'user'
          // 'avatarPath' is the static method/function created in userSchema
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }

        user.save();
        req.flash('success', 'Profile updated!');
        return res.redirect('back');
      });
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
  } else {
    req.flash('error', 'Unauthorized!');
    return res.status(401).send('Unauthorized'); // 401 is HTTP Status Code for Unauthorized
  }
};

// render the sign up page
module.exports.signUp = function (req, res) {
  // if user is already signed in, then redirect to profile page
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }

  return res.render('user_sign_up', {
    title: 'Codeial | Sign Up'
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  // if user is already signed in, then redirect to profile page
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }

  return res.render('user_sign_in', {
    title: 'Codeial | Sign In'
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash('error', 'Passwords do not match!');
    return res.redirect('back');
  }
  // find user by 'email' parameter/property
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      req.flash('error', 'Error in finding user in signing up.');
      return;
    }
    if (!user) {
      // if user is not created
      User.create(req.body, function (err, user) {
        if (err) {
          req.flash('error', 'Error in creating user while signing up.');
          return;
        }
        return res.redirect('/users/sign-in'); //url
      });
    } else {
      // i.e. user is already created
      req.flash('success', 'You have signed up, login to continue.');
      return res.redirect('back');
    }
  });
};

// sign in and create a session for user
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in successfully.');
  return res.redirect('/');
};

// sign out
module.exports.destorySession = function (req, res) {
  req.logout();
  req.flash('success', 'You have logged out!');
  return res.redirect('/');
};
