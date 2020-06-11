const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){

    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // return res.end('<h1> Express is up for Codeial! </h1>');

    // this query will return all the posts
    // preload/populate the user of each post (i.e. fetching user Object from user ObjectId)
    // preloading/populating comments and user of the comment (nested population)
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        User.find({}, function(err, users){
            return res.render('home', {
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            });
        });
    });
};

// module.exports.actionName = function(req, res){};