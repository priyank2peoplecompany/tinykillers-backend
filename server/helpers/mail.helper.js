const path = require('path');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const ejs = require('ejs');

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'jack.bravo.7288@gmail.com', // Your email id
        pass: 'Qwerty123@#'
    }
}));

/**
 * Function will send the mail 
 * 
 * data :
 * {
 *      from : mail-id
 *      to : mail-id
 *      subject : Mail Subject
 *      template : email template name
 *      temp_data : ( JSON ) dynamic data that will be rendered 
 * }
 */

exports.SignupMail = (mail_data, password, college_name) => {

    const email = mail_data.email;
    const subject = `Your Password Details! `;
    let data = {};
    data['college_name'] = college_name;
    data['name'] = `${mail_data.first_name} ${mail_data.last_name}`;
    data['password'] = password;
    data['email'] = email;
    data['role'] = 'faculty';

    var mail_data = {
        'template': 'signup',
        'temp_data': data,
        'subject': subject,
        'to': email
    };

    this.sendMail(mail_data).then(rdata => {
        console.log('Mail Success : ---------------------------> ', rdata);
    }).catch(err => {
        console.log('Mail Failed : ---------------------------> ', err);
    });
}

exports.sendMail = (data) => {

    console.log("data.template========>",data.template);
    //var template = path.join(__dirname, '../../templates/email/',data.template);
    var template = path.join(__dirname, './../templates/email/suggestion/html.ejs');
    return ejs.renderFile(template, data.temp_data, function (err, result) {
        if (err) {
            return Promise.reject(err);
            //cres.error(res, "Error in sending suggestion mail", err);
        } else {
            var mailOptions = {
                from: 'noreply@tinykiller.com', // sender address
                to: 'priyank@twopeople.company', // list of receivers
                subject: 'New Suggestion Mail', // Subject line
                html: result // You can choose to send an HTML body instead
            };
            return transporter.sendMail(mailOptions);
        }
    });
}