const path = require('path');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const ejs = require('ejs');

/**
 * @api {post} /user/Add Add User
 * @apiName Add User
 * @apiGroup User
 * @apiParam {string}   name        Name
 * @apiParam {email}    email       Email
 * */
exports.AddUser = (req, res) => {
    const required_fields = {
        'name': 'string',
        'email': 'email'
    }
    let params = req.body;
    if (vh.validate(res, required_fields, params)) {

        model.User.findOneAndUpdate({ email: params.email }, params, {
            new: true,
            upsert: true // Make this update into an upsert
        }).then(data => {
            cres.send(res, data, "User created successfully");
        }).catch((err) => {
            cres.error(res, "Error in adding users", err);
        });
    }
}

/**
 * @api {get} /user/list List User
 * @apiName List User
 * @apiGroup User
 * */
 exports.ListUser = (req, res) => {
    model.User.find({}).then(data => {
        cres.send(res, data, "User list successfully");
    }).catch((err) => {
        cres.error(res, "Error in user list", err);
    });
}

/**
 * @api {post} /mail/send Send User Suggestion Mail
 * @apiName Suggestion Mail
 * @apiGroup Mail
 * @apiParam {String}  email        From Email Address
 * @apiParam {String}  suggestion   Suggestion
 */
 exports.sendMail = (req, res) => {

    const required_fields = {
        'suggestion': 'string',
        'email': 'string'
    }
    let params = req.body;
 
    if (vh.validate(res, required_fields, params)) {

        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.EMAIL, // Your email id
                pass: process.env.PASS
            }
        }));
        
        var template = path.join(__dirname, '../../templates/email/suggestion/html.ejs');
        ejs.renderFile(template, params, function (err, result) {
            if (err) {
                cres.error(res, "Error in sending suggestion mail", err);
            } else {
                var mailOptions = {
                    from: 'noreply@tinykiller.com', // sender address
                    to: 'priyank@twopeople.company', // list of receivers
                    subject: 'New Suggestion Mail', // Subject line
                    html: result // You can choose to send an HTML body instead
                };               

                transporter.sendMail(mailOptions, (err, info) => {
                    if(err){
                        transporter.close();
                        cres.error(res, "Error in sending suggestion mail", err);
                    }
                    else{
                        transporter.close();
                        cres.send(res, info.messageId, "Suggestion mail send successfully");
                    }                    
                });
            }
        });
    }
}