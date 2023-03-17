const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path : './assets',
    session_cookie_key: 'blahsomething',
    db: 'macebook_development',
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '<Add username>', // generated ethereal user
            pass: '<Add pass>', // generated ethereal password
        },
    },
    google_clientID: "<Add client ID>",
    google_clientSecret: "<Add secret key>",
    google_callbackURL: "http://127.0.0.1:8000/users/auth/google/callback",
    jwt_secret: process.env.NODE_ENV,
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path : process.env.ASSET_PATH,
    session_cookie_key: process.env.SESSION_COOKIE_KEY,
    db: process.env.DB,
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: '<Add username>', 
            pass: '<Add pass>', 
        },
    },
    google_clientID: process.env.GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

// module.exports = development;
module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);