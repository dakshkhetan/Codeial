const Post = require('../models/post');
const User = require('../models/user');

module.exports.home =  async function(req, res){

    // this query will return all the posts
    // preload/populate the user of each post (i.e. fetching user Object from user ObjectId)
    // preloading/populating comments and user of the comment (nested population)
    
    try {

        let posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

        let users = await User.find({});

        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });

    } catch(err) {
        console.log("Error", err);
        return;
    }
};

// module.exports.actionName = function(req, res){};