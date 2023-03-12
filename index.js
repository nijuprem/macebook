const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// Used for session cookie
const session = require('express-session');
const passport = require('passport');
// const LocalStrategy = require('./config/passport-local-strategy').Strategy;
const LocalStrategy = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongodb-session')(session);// Session  is the express session we had initiated above
const flash = require('connect-flash');
const customMware =  require('./config/middleware');
const passportgoogle = require('./config/passport-config-oauth2-strategy')

app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
// Uploads folder is available in /upload path, basically make uploads folder available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);
 

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// MongoStore to save cookie in DB
app.use(session({
    name: 'macebook',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // Time till which cookie to be saved in milliseconds
    },
    store: new MongoStore(
        {
          uri:'mongodb://127.0.0.1:27017/macebook_development',
            // mongooseConnection : db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || "Connection working ok mongo-cookie storage")
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticationUser);

app.use(flash()); // to use connect-flash
app.use(customMware.setFlash)

// use express router
app.use('/', require('./routes'));

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
 