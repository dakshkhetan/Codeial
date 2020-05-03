module.exports.profile = function(req, res){
  // return res.end('<h1> User Profile page! </h1>');
  return res.render('user_profile', {
    title: "User Profile"
  });
};

// module.exports.actionName = function(req, res){};