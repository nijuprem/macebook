const Post = require('../models/post')
const User = require('../models/user')

module.exports.home = async function(req, res){
  try{
            // Populate user of each obj
        let posts = await Post.find({})
        .sort("-createdAt")
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        })
        let users = await User.find({});

        return res.render('home', {
            title: "MaceBook | Home",
            posts : posts,
            all_users: users
        });
    }catch(err){
        console.log('Error', err);
        return
    }
    

}

// module.exports.home = async function(req, res){
  
//     // Populate user of each obj
//     Post.find({})
//     .populate('user')
//     .populate({
//         path: 'comments',
//         populate:{
//             path: 'user'
//         }
//     })
//     .exec(function(err, posts){

//         User.find({}, function(err, users){
//             return res.render('home', {
//                 title: "MaceBook | Home",
//                 posts : posts,
//                 all_users: users
//             });
//         });
        
//     });

// }