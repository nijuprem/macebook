const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) =>{

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
    from: '<From Address>', // sender address
    to: comment.user.email, // list of receivers
    subject: "New Comment Published", // Subject line
    // text: "Hello world?", // plain text body
    html: htmlString, // html body
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }
        console.log("Mail sent", info);
            return;
    });
}