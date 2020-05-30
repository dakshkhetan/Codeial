const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if(err){
            console.log("Error in creating a post");
            return;
        }
        return res.redirect('back');
    });
};

module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        // .id means converting the objectId (._id) into string
        if(post.user == req.user.id){   // user can only delete its own posts
            post.remove();
            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            });
        } else {
            return res.redirect('back');
        }
    });
};