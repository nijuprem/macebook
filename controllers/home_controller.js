const Post = require('../models/post')
const User = require('../models/user')

module.exports.home = function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 100);
    // res.cookie('name', 'random');

    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Home",
    //         posts : posts
    //     });
    // })

    // Populate user of each obj
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path: 'user'
        }
    })
    .exec(function(err, posts){

        User.find({}, function(err, users){
            return res.render('home', {
                title: "MaceBook | Home",
                posts : posts,
                all_users: users
            });
        });
        
    });

}

// module.exports.actionName = function(req, res){}