const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if(err){ console.log("Error in Post controller"); return; }
        return res.redirect('back');

    })
}
 
module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(post.user == req.user.id){ // post.user is basiclaly id and it should be req.user._id but here when ccomparison it should be strings so mongoose gives us a variant i.e. using "req.user.id"
            post.remove();

            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    });
}