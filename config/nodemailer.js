const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',   // uses SMTP (Simple Mail Transfer Protocol) protocol
    port: 587,  // for TLS
    secure: false,
    auth: {
        // turn on 'Less Secure App Access' for this Gmail account
        user: '',
        pass: ''
    }
});

// rendering an HTML email where that file would be stored inside (../views/mailers) directory
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),   // 'relativePath' is the path from where this function is being called
        data,   // the context which is to be passed to EJS (which is to be filled inside the template)
        function(err, template){
            if(err){
                console.log("Error in rendering template");
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
};