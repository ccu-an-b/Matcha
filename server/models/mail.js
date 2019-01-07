const nodemailer = require('nodemailer');

function activation_mail(){
    
    //    service: ''
    // //   auth: {
    // //     user: 'youremail@gmail.com',
    // //     pass: 'yourpassword'
    // //   }
    // });
    // let transporter = nodemailer.createTransport({
    //     port: 3000,
    //     ignoreTLS: true
    // })

    let transporter = nodemailer.createTransport();
    var mailOptions = {
    from: 'matcha@contact.com',
    to: 'ccu-an-b@student.42.fr',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    activation_mail
}