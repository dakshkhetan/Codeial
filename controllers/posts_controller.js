const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try {
        
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        // to check if an AJAX request is made
        if(req.xhr){    // XMLHttpRequest : it's the type of an AJAX request
                
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();
    
            return res.status(200).json({   // 200 is for success
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }
        
        req.flash('success', 'Post published!');
        return res.redirect('back');

    } catch(err) {
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
};

module.exports.destroy = async function(req, res){
    try {

        let post = await Post.findById(req.params.id);
        // .id means converting the objectId (._id) into string
        if(post.user == req.user.id){   // user can only delete its own posts

            post.remove();
            await Comment.deleteMany({post: req.params.id});

            // to check if an AJAX request is made
            if(req.xhr){
                return res.status(200).json({   // 200 is for success
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted!"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');

        } else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    } catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }
};