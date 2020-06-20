const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){
    try {

        // 'req.body.post' , here 'post' is the name of hidden input in comment-form
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post   // or post._id
            });

            // adding comment to the post (comment array defined in postSchema)
            post.comments.push(comment);
            post.save();

            req.flash('success', 'Comment published!');
            return res.redirect('/');
        }

    } catch(err) {
        req.flash('error', err);
        return;
    }
};

module.exports.destroy = async function(req, res){
    try {

        let comment = await Comment.findById(req.params.id);

        // TODO: delete comments of other users on own posts
        // Post.findById(comment.post, function(err, post){
        //     // console.log(post.user);
        //     console.log(post.user.id);
        // });
        // console.log(post.user.id);
        
        // if((comment.user == req.user.id) || (post.user == req.user.id)){
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            // important: we need to update the comments array in the postSchema
            // $pull is an inbuilt function of mongoose
            let post = await Post.findByIdAndUpdate(postId, { $pull : {comments: req.params.id}});
            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this comment!');
            return res.redirect('back');
        }

    } catch(err) {
        req.flash('error', err);
        return;
    }
};