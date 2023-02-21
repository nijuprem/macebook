const Post = require('../models/post')

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
    Post.find({}).populate('user').exec(function(err, posts){
        return res.render('home', {
            title: "MaceBook | Home",
            posts : posts
        });
    });

}

// module.exports.actionName = function(req, res){}