const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    // 'req.body.post' , here 'post' is the name of hidden input in comment-form
    Post.findById(req.body.post, function(err, post){    
        if(err){
            console.log("Error in finding post");
            return;
        }

        if(post){
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post   // or post._id
            }, function(err, comment){
                if(err){
                    console.log("Error in creating comment to post");
                    return;
                }

                // adding comment to the post (comment array defined in postSchema)
                post.comments.push(comment);
                post.save();

                return res.redirect('/');
            });
        }
    });
};

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            // important: we need to update the comments array in the postSchema
            // $pull is an inbuilt function of mongoose
            Post.findByIdAndUpdate(postId, { $pull : {comments: req.params.id}}, function(err, post){
                return res.redirect('back');
            })
        } else {
            return res.redirect('back');
        }
    });
};