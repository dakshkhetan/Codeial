// module.exports.actionName = function(req, res){};

module.exports.profile = function(req, res){
  // return res.end('<h1> User Profile page! </h1>');
  return res.render('user_profile', {
      title: "User Profile"
  });
};

// render the sign up page
module.exports.signUp = function(req, res){
  return res.render('user_sign_up', {
      title: "Codeial | Sign Up"
  });
};

// render the sign in page
module.exports.signIn = function(req, res){
  return res.render('user_sign_in', {
      title: "Codeial | Sign In"
  });
};

// get the sign up data
module.exports.create = function(req, res){
  // TODO Later
};

// sign in and create a session for user
module.exports.createSession = function(req, res){
  // TODO Later
};