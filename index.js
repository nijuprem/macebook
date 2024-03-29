const dotenv = require('dotenv').config({path: './config.env'});

const express = require('express');      
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
require('./config/view_helpers')(app);    
const port = 8000;
const env = require('./config/enviornment');
const logger = require('morgan');
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
const passportgoogle = require('./config/passport-config-oauth2-strategy');

// Setting up socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

chatServer.listen(5000);
console.log("Chat server working")

app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.urlencoded());
app.use(cookieParser()); 

app.use(express.static(env.asset_path));
// Uploads folder is available in /upload path, basically make uploads folder available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
 

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// MongoStore to save cookie in DB
app.use(session({
    name: 'macebook',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // Time till which cookie to be saved in milliseconds
    },
    store: new MongoStore(
        {
          uri:'mongodb+srv://nijuprem7:nptestdb@cluster0.x2suycd.mongodb.net/?retryWrites=true&w=majority',
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
 