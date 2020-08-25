// this is done to prevent the page from reloading again & again
// after creation of every post, i.e. we need to convert it to AJAX

// method to submit the form data for new post using AJAX
let createPost = function () {
  let newPostForm = $('#new-post-form');

  newPostForm.submit(function (e) {
    e.preventDefault();

    $.ajax({
      type: 'post',
      url: '/posts/create',
      data: newPostForm.serialize(),
      success: function (data) {
        // console.log(data);
        let newPost = newPostDom(data.data.post);
        $('#posts-list-container>ul').prepend(newPost);

        // to populate the 'deleteLink' parameter inside 'deletePost()' function defined below
        // below statement means, class named 'delete-post-button' inside the object 'newPost'
        // there should be a space before .delete-post-button
        // this is JQuery syntax
        deletePost($(' .delete-post-button', newPost));

        // call the create comment class
        new PostComments(data.data.post._id);

        // enable the functionality of the toggle like button on the new post
        new ToggleLike($(' .toggle-like-button', newPost));

        new Noty({
          theme: 'relax',
          text: 'Post published!',
          type: 'success',
          layout: 'topRight',
          timeout: 1500
        }).show();
      },
      error: function (error) {
        console.log(error.responseText);
      }
    });
  });
};

// method to create a post in DOM
let newPostDom = function (post) {
  // code copied from _post.ejs in views
  // then made changes to convert EJS syntax to JQuery
  // used back-ticks
  // show the count of likes as zero on this post (i.e. when a new post is created)
  return $(`<li id="post-${post._id}">
              <p>
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">
                        X
                    </a>
                </small>
                ${post.content}
                <br>
                <small>
                    ${post.user.name}
                </small>
                <br>
                <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 Likes
                    </a>
                </small>
              </p>
              <div class="post-comments">
                <form action="/comments/create" id="new-comment-form" method="POST">
                  <input type="text" name="content" placeholder="Type here to add comment..." required>
                  <input type="hidden" name="post" value="${post._id}">
                  <input type="submit" value="Add Comment">
                </form>
                <div class="post-comments-list">
                  <ul id="post-comments-${post._id}"></ul>
                </div>
              </div>
            </li>`);
};

// method to delete a post from DOM
let deletePost = function (deleteLink) {
  $(deleteLink).click(function (e) {
    e.preventDefault();

    $.ajax({
      type: 'get',
      url: $(deleteLink).prop('href'), // fetches the url defined in 'href' attribute of 'a' tag
      success: function (data) {
        $(`#post-${data.data.post_id}`).remove();
        new Noty({
          theme: 'relax',
          text: 'Post Deleted',
          type: 'success',
          layout: 'topRight',
          timeout: 1500
        }).show();
      },
      error: function (error) {
        console.log(error.responseText);
      }
    });
  });
};

// loop over all the existing posts on the page (when the window loads for the first time)
// and call the delete post method on delete link of each,
// also add AJAX (using the class we've created) to the delete button of each
let convertPostsToAjax = function () {
  $('#posts-list-container>ul>li').each(function () {
    let self = $(this);
    let deleteButton = $(' .delete-post-button', self);
    deletePost(deleteButton);

    // get the post's id by splitting the 'id' attribute
    // splitting is done when hyphen (-) is encountered
    // i.e. id="post-${ post._id }
    // [1] refers to the first element in the array
    let postId = self.prop('id').split('-')[1];
    new PostComments(postId);
  });
};

createPost();
convertPostsToAjax();
