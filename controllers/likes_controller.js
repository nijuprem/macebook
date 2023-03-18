const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try{

        let likeable;
        let deleted = false; 

        // To check in which like count needs to be increased
        
        if(req.query.type = 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes')
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes')
        }
 
        // Check if user has already liked
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        if (existingLike){
            likeable.likes.pull(existingLike._id); // To pull from the array
            likeable.save();

            existingLike.remove();
            deleted = true;

        }else{
            // else make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            // console.log(newLike._id, newLike)
            likeable.likes.push(newLike._id);
            likeable.save();

        }

        return res.status(200).json({
            message: "Request Successful",
            data:{
                deleted: deleted
            }
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}  