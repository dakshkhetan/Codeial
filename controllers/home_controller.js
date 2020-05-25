const Post = require('../models/post');

module.exports.home = function(req, res){

    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // return res.end('<h1> Express is up for Codeial! </h1>');

    // // this query will return all the posts
    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // });

    // this query will return all the posts and
    // populate the user of each post (i.e. fetching user Object from user ObjectId)
    Post.find({}).populate('user').exec(function(err, posts){
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    });
};

// module.exports.actionName = function(req, res){};