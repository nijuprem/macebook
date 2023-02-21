const User = require('../models/user');

// module.exports.profile = function(req, res){

//     if(req.cookies.user_id){
//         User.findById(req.cookies.user_id, function(err, user){
//             if(user){
//                 return res.render('user_profile', {
//                     title: 'User Profile',
//                     user: user
//                 })
//             }
//             // else {return res.redirect('/users/sign-in');} 
//         })
//     }
//     else {return res.redirect('/users/sign-in');}
    
// }

module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}

// Render Sign Up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }

    return res.render('user_sign_up', {
        title: "MaceBook | Sign Up"
    })
    
}

// Render Sign In page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }

    return res.render('user_sign_in', {
        title: "MaceBook | Sign In"
    })
}

// For sign up form
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    // Will check if user is alreqady in DB
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('Error in finding user for signing up'); return }
    
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('Error in signing up'); return }

                return res.redirect('/users/sign-in'); // redirect to sign in page if signed up
            })
        }else{
            return res.redirect('back')
        }

    });

    
}

// For sign in form

module.exports.createSession = function(req, res){
    return res.redirect('/')
}


module.exports.destroySession = function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    
    // req.logout();
    // return res.redirect('/');
}








// For Manual sign in
// module.exports.createSession = function(req, res){

//     // Find the user
//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){console.log('Error in finding user for signing in'); return }
        
//         // Check if user is available
//         if(user){

//             // If available authenticate if pass is correct
//             if(user.password != req.body.password){
//                 return res.redirect('back');
//             }

//             // Handle session

//             res.cookie('user_id', user.id)
//             return res.redirect('/users/profile')

//         }
//         else{
//                 return res.redirect('back');
//         }
    
//     });
// }