const   nodemailer = require('nodemailer');

function activation_mail(username, email, key){

    var link = "http://localhost:3000/"+key;
    var subject = "Welcome to Matcha";
    var body = '<table bgcolor="#ffffff" class="content" align="center" cellpadding="0" cellspacing="0" border="0" style="width:100%"><tbody>' +
                    '<tr><td align="center" valign="top">' +
                        '<table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateContainerMiddle" style="margin-bottom:30px"> <tbody>'+
                            '<tr><td valign="top" class="bodyContent" mc:edit="body_content" style="color:#3f3c3b; text-align:center">'+
                                '<h3 style="color:#3f3c3b ;margin-bottom: 0px; margin-top: 20px; text-transform: capitalize;">Hi '+username+',</h3>'+
                                '<p style="color:#3f3c3b;margin-top: 10px;margin-bottom: 30px;"><span style="color:#3f3c3b">You&apos;re now one step away from your perfect match !</span> <br><span style="color:#3f3c3b"> Click on the link below to complete your registration.</span></p>'+
                                '<a href="'+link+'" style="background: linear-gradient(332deg, #363B6D 0%, #E83114 100%);padding: 10px 20px;color: white;border-radius: 0.25rem;letter-spacing: 1px;text-decoration: none;text-transform: uppercase;margin-top: 0p;">Confirm your email</a>' +
                            '</td></tr>'+
                        '</tbody> </table>' + 
                    '</td></tr>'+
                '</tbody></table>';
    send_mail(email, subject,body);
}

function send_mail(email, subject, body){
    let transporter = nodemailer.createTransport();
   
    var mailOptions = {
    from: 'matcha@no-reply.com',
    to: email,
    subject: subject,
    html:   '<table style="width:100%; border-collapse: collapse; border-spacing: 0;" align="center" ><tbody>'+
                '<tr><td>' +
                    '<table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;font-family:Helvetica,Arial,sans-serif;letter-spacing:0;table-layout:fixed"><tbody>' +
                        '<tr><td>' +
                            '<table bgcolor="#ffffff" align="center" class="content" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0"><tbody>' +
                                '<tr><td align="center" valign="top" width:"100%">' +
                                    '<img align="center" class="CToWUd" src="https://lh3.googleusercontent.com/h40SguQrtL9NUSBqLpiDYdSSlkoU6MnDlt6yTFb3rzz6-E-WbxE_NB6X6F_JsswBA7UaskaqJ2i1lK3WG7a9Lmm6cI8qzHc4KBpnAGKPs5SOowfPep395h6I8b4LfOSFK6hFZVyNvIft618EPxKzJ5pmaXzTVB-FSjebAD1SV8--oC-l-1hSnZeu1buABZQ_mWOkmdLon1W7b62frBB68K1MlsvghqAyLv7MeukKk5oC_CI7clbj5KlLcKRamLqxaSq5wKL5DOidU79-wSjPXADhW16dhgeuJFkJqqhDcarzrwNVPlsvd-JqAHgxod6nf1GW1VHRnaChWw1tBqgYX3r1i7O--nWrJyWhri3nxcgq9GPU_TstNQR0wDJosjF8He3kyqh7mz39DKQmtnRA9g85FtJp80YPKv767nS_FCqTWP4VO2a1FMkXDBwhwmh7aIw6XTsoprPMpoxEpRe8ZavvWCYwrGwh5v_PK1RAs_MJ3X7kKmwlvrpqeYHNoA8t6LwjdDEh_g5skO3CMQ90ZUQEuSukt2Ydym5MOQ2xO2d28i97gX8IrPboQ2kuihnjWJ37vNFDBXqS6zp2F7hVyeha9Qv3fwBMBMt1csbpzhygsH3PQDjJ-wvbn-kcqrny1Bp3oNzxsU36WWpdsZo-7AGPDiq8637XQv7w_JwJGzDWev26JtZPq78qiUOzqZYDtlpJl6FVhiStMAqNkw=w1346-h369-no" style="height:40px; margin: auto">' +
                                '</td></tr>' + 
                            '</tbody></table>'+
                        '</td></tr>' +

                        '<tr><td align="center" valign="top">' +
                            '<table border="0" cellpadding="0" cellspacing="0" width="100%" id="templateContainerImageFull" style="/* min-height:15px; */"><tbody>' +
                                '<tr><td valign="top" class="bodyContentImageFull" mc:edit="body_content_01">'+
                                    '<p style="text-align:center;margin:0;padding:0;float:right;"><img src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1351&amp;q=80" style="display:block;margin:0;padding:0;border:0;height: 200px;object-fit: cover; width: 100%;filter: grayscale(40%);"></p>' +
                                '</td></tr>'+
                            '</tbody></table>' +
                        '</td></tr>'+

                        '<tr><td>' + 
                        body +
                        '</td></tr>' + 
                    
                        '<tr><td align="center" valign="top">'+
                            '<table bgcolor="#FFFFFF" border="0" cellspacing="0" cellpadding="0" width="100%"><tbody>' +
                                '<tr><td width="100%" bgcolor="#ffffff" style="text-align:left; padding-left:0px;border-top: 1px dashed grey;padding-top: 10px;">' +
                                    '<p style="color:grey; font-family:Arial, Helvetica, sans-serif; font-size:11px; line-height:14px; margin-top:0; margin-bottom:15px; padding:0; font-weight:normal; text-align:center">This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message. Copyright 2019 Matcha. All Rights Reserved. </p>' +
                                '</td></tr>' + 
                            '</tbody></table>'+
                        '</td></tr>' +
                    '</tbody></table>' +
                '</td></tr></tbody></table>' 
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

