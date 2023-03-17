const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy; // To import strategy
const ExtractJWT = require('passport-jwt').ExtractJwt; // to extract jwt module from the header
const env = require('./enviornment')
const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // TO extract tokens
    secretOrKey : env.jwt_secret
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done){
    User.findById(jwtPayload._id, function(err, user){
        if(err){console.log("Error in finding user from JWT"); return;}

        if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    });

}))

module.exports = passport;