const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')

// This entire code is basically creaing as session.

// authenticate using passport
passport.use(new LocalStrategy({
        usernameField : 'email',
        passReqToCallback: true
    },
    function(req, email, password, done){
        // find user and establish identity
        User.findOne({email: email}, function(err, user){
            if(err){
                console.log('Invalid Username or Password');
                // req.flash('error', 'err')
                return done(err)
            }
            if(!user || user.password != password){
                // console.log('Invalid Username or Password');
                req.flash('error', 'Invalid Username/Password');
                return done(null, false)
            }

            return done(null, user);
        })
    }

));

// Serialize the user to decide which key to keep in cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// Deserialize the user from key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user');
            return done(err)
        }
        return done(null, user)
    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if user is authenticated passs on the request to next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if user not signed in
    return res.redirect('/users/sign-in')
}

passport.setAuthenticationUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user; // req.user has data stored by passport after user login and it is transferred to res.local.user
    }
    next();
}

module.exports = passport;