{
    // To submit form data using ajax

    let createPost = function () {
        let newPostForm = $("#new-post-form");

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({ 
                type: 'post',
                url: "/post/create",
                data: newPostForm.serialize(), // Used to convert data from form to JSON
                success: function (data) {
                    console.log(data.data.post);
                    let newPost = newPostDom(data.data.post);
                    $('.list-container>ul').prepend(newPost)
                    deletePost($(' .delete-post-button', newPost));

                    new PostComments(data.data.post._id);

                   // enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a post in DOM
    let newPostDom = function (post) {
        return (`<li id="post-${post._id}">
            <p>
                <small>
                    <a class= "delete-post-button" href="/post/destroy/${post._id}">Delete</a>
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

                    <form action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="Type Here to add comment...">
                        
                        <input type="hidden" name="post" value="${post._id}"> 
                        <input type="submit" value="Add Comment">
                    </form>
        
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                        
                        </ul>
                    </div>
            </div>
        
        </li>`)
    }



    // TO delete a post

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}