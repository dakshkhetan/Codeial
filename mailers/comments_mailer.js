const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment) => {

    console.log("** Inside newComment mailer **");
    console.log("Comment Details:", comment);

    nodeMailer.transporter.sendMail({
        from: 'dakshkhetan@codeial.com',
        to: comment.user.email,
        subject: 'New Comment Published!',
        html: '<h1>Yup, your comment is now published!</h1>'
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }

        console.log("Mail sent", info);
        return;
    });
}