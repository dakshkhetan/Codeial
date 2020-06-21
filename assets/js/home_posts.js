{
  // this is done to prevent the page from reloading again & again 
  // after creation of every post, i.e. we need to convert it to AJAX

  // method to submit the form data for new post using AJAX
  let createPost = function(){
      
      let newPostForm = $('#new-post-form');

      newPostForm.submit(function(e){
          e.preventDefault();

          $.ajax({
              type: 'post',
              url: '/posts/create',
              data: newPostForm.serialize(),
              success: function(data){
                  // console.log(data);
                  let newPost = newPostDom(data.data.post);
                  $('#posts-list-container>ul').prepend(newPost);
              }, error: function(error){
                  console.log(error.responseText);
              }
          });
      });
  };

  // method to create a post in DOM
  let newPostDom = function(post){

      // code copied from _post.ejs in views
      // then made changes to convert EJS syntax to JQuery
      // used back-ticks
      return $(`<li id="post-${ post._id }">
                  <p>
                      <small>
                          <a class="delete-post-button" href="/posts/destroy/${ post.id }">
                              X
                          </a>
                      </small>
              
                      ${ post.content }
                      <br>
              
                      <small>
                          ${ post.user.name }
                      </small>
              
                      <div class="post-comments">
                          <form action="/comments/create" id="new-comment-form" method="POST">
                              <input type="text" name="content" placeholder="Type here to add comment..." required>
                              <input type="hidden" name="post" value="${ post._id }">
                              <input type="submit" value="Add Comment">
                          </form>
              
                          <div class="post-comments-list">
                              <ul id="post-comments-${ post._id }">
                                  
                              </ul>
                          </div>
              
                      </div>
                  </p>
              </li>`);
  };

  createPost();
}
