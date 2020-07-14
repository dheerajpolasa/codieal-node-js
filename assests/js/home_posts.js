{
    // method to submit form data using ajax
    let createPost = function() {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
                    let newPost = newPostDOM(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost))
                }, error: function(error) {
                    console.log(error.responseText);
                }
            });
        });
        console.log(newPostForm)
        
    }

    let newPostDOM = function(post) {
        return $(`<li id="post-${post._id}">
        <p>
            <a href="/posts/destroy/${post._id}">X</a>
            ${post.content}
            <small>
                ${post.user}
            </small>
        </p>
        <div class="post-comments">
                <form action="/comments/create" method="POST">
                    <textarea name="comment" id="comment" cols="30" rows="2" placeholder="Comment Here"></textarea>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Comment">
                </form>
            <div class="post-comments-list">
                <ul class="post-comments-${post._id}">
                   
                </ul>
            </div>
        </div>
        
    </li>`)

    }

    // function to delete post from DOM
    let deletePost = function(deleteLink) {
        $(deleteLink).click(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    $(`#post-${data.data.post_id}`).remove();
                }, error: function(error) {
                    console.log(error.responseText)
                }
            })
        })
    }


    createPost();
}