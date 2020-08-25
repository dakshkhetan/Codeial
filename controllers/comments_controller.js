const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function (req, res) {
  try {
    // 'req.body.post' , here 'post' is the name of hidden input in comment-form
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        user: req.user._id,
        post: req.body.post // or post._id
      });

      // adding comment to the post (comment array defined in postSchema)
      post.comments.push(comment);
      post.save();

      // populating 'user' (with 'name' & 'email' keys) in 'comment' everytime a new comment is created
      comment = await comment.populate('user', 'name email').execPopulate();

      // commentsMailer.newComment(comment);

      let job = queue.create('emails', comment).save(function (err) {
        if (err) {
          console.log('Error in sending to the queue', err);
          return;
        }
        console.log('Job enqueued:', job.id);
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment
          },
          message: 'Comment created!'
        });
      }

      req.flash('success', 'Comment published!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    // TODO: delete comments of other users on own posts
    // Post.findById(comment.post, function(err, post){
    //     // console.log(post.user);
    //     console.log(post.user.id);
    // });
    // console.log(post.user.id);

    // if((comment.user == req.user.id) || (post.user == req.user.id)){
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();

      // important: we need to update the comments array in the postSchema
      // $pull is an inbuilt function of mongoose
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id }
      });

      // destroy the associated likes for this comment
      await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id
          },
          message: 'Comment deleted'
        });
      }

      req.flash('success', 'Comment deleted!');
      return res.redirect('back');
    } else {
      req.flash('error', 'You cannot delete this comment!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};
