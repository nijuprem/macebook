const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    })
    
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id){
        try{
            let user = await User.findByIdAndUpdate(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('**** Multer Error *****', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar))
                    }
                    // saving path of uploaded file in avatar filed in user DB
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back')
            })

        }catch(err){
        req.flash('error', err);
        return res.redirect('back');
        }
        
    }else{
        req.flash('error', 'Unauthorized')
        return res.status(401).send('Unauthorized');
    }
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
    req.flash('success', 'Signed in Successfully');
    return res.redirect('/')
}


module.exports.destroySession = function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }

        req.flash('success', 'Logged Out Successfully');
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