const Post = require('../../../models/post')
const Comments = require('../../../models/comment')

module.exports.index = async function(req, res){
    try{
    let posts = await Post.find({})
        .sort("-createdAt")
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        })
    

    return res.status(200).json({
        message: "List of Posts",
        posts: posts
    }); 

}catch(err){
        console.log("****", err);
        return res.status(500).json({
            message: "Internal Server Error"
        }); 
    }
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            post.remove();

           await Comments.deleteMany({post: req.params.id})

           return res.status(200).json({
            message: "Post and associated comments deleted successfully"
        }); 
        }
        else{
            res.status(401).json({
                message: "You cannot delete the post"
            })
        }

    }catch(err){
        console.log("****", err);
        return res.status(500).json({
            message: "Internal Server Error"
        }); 
    }
}