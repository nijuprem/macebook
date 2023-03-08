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
                url: $(delete-post-button).prop('href'), // this is how to get href of anchor tag
                success: function(data){
                    $(`#post-${data.data.post._id}`).remove();
                }, error: function(err){
                    console.log(err.responseText)
                }
            });
        })
    }

    createPost();
}