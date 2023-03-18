const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function (req, res) {

    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
 
        if(req.xhr){
            return res.status(200).json({ // 200 means status is successful
                data: {
                    post: post
                }, 
                message: "Post Added!"
            })
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }

}

module.exports.destroy = async function (req, res) {

    try {
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) { // post.user is basiclaly id and it should be req.user._id but here when ccomparison it should be strings so mongoose gives us a variant i.e. using "req.user.id"

            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            
            post.remove();

            await Comment.deleteMany({ post: req.params.id });
            // if(re1.xhr){
            //     return res.status(100).json({
            //         data: {
            //             post_id : req.params.id
            //         },
            //         message: "post deleted"
            //     })
            // }

            // req.flash('success', 'Post and its Comments Deleted');

            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }


}