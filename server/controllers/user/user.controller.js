const path = require('path');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const ejs = require('ejs');
const { Mongoose } = require('mongoose');

/**
 * @api {post} /user/Add Add User
 * @apiName Add User
 * @apiGroup User
 * @apiParam {string}   address     User Address
 * */
exports.AddUser = (req, res) => {
    const required_fields = {
        'address': 'string'
    }
    let params = req.body;
    if (vh.validate(res, required_fields, params)) {

        model.User.findOneAndUpdate({ address: params.address }, params, {
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
 * @api {post} /user/details User Details
 * @apiName User Details
 * @apiParam {String}   id          Login User Id 
 * @apiGroup User
 * */
 exports.DetailUser = (req, res) => {
    const required_fields = {
        'id': 'string',
    }
    let params = req.body;
    if (vh.validate(res, required_fields, params)) {
        model.User.find({_id : mongoose.Types.ObjectId(params.id)}).then(data => {
            cres.send(res, data, "User list successfully");
        }).catch((err) => {
            cres.error(res, "Error in user list", err);
        });
    }
}

/**
 * @api {post} /user/answer Add user quiz answer
 * @apiName User Answer
 * @apiGroup User
 * @apiParam {String}   user_id          Login User Id
 * @apiParam {String}   question_id      Question Id
 * @apiParam {String}   answer           Answer Id
 * @apiParam {String}   mint             Total Selected Mint
 * @apiParam {Boolean}  quiz_completed   Quiz completed True/False
 */
 exports.QuizAnswer = (req, res) => {
    const required_fields = {
        'user_id': 'string',
        'question_id': 'string',
        'answer' : 'string',
        'mint' : 'integer',
        'quiz_completed' : "boolean"
    }
    let params = req.body;
    if (vh.validate(res, required_fields, params)) {

        let answer = params.answer;
        let question_id = params.question_id;
        model.Quiz.find({'_id': question_id , 'options._id' : answer},{ 'options.$': 1 }).then(quizData => {
            let point = quizData[0].options[0].point;
            if(quizData && point > 0){
                let updateData = { question_id: params.question_id , answer : params.answer };
                model.User.findOneAndUpdate(
                    { _id: params.user_id }, 
                    {
                        total_mint: params.mint,
                        quiz_completed : params.quiz_completed, 
                        last_answer_time: + new Date(),
                        $inc: { total_point: parseInt(point) },
                        $push: { quiz_answers :  updateData } 
                    }, 
                    {
                        new: false,
                        upsert: false // Make this update into an upsert
                    }
                ).then(data => {
                    updateClan(params.user_id,parseInt(point) + parseInt(data.total_point))
                    cres.send(res, data, "Answer added successfully");
                }).catch((err) => {
                    cres.error(res, "Error in adding answer", err);
                });
            }
            else{
                cres.error(res, "Please check your question or answer ids");
            }
        }).catch((err) => {
            console.log(err,"err===");
            cres.error(res, "Error in quiz list", err);
        });        
    }
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

function updateClan(user_id,total){

    let clan = '';
    if(total >= 1 && total <= 9 ){
        clan = 'TOZAWA CLAN';
    }
    else if(total >= 10 && total <= 13 ){
        clan = 'KUSAKI CLAN';
    }
    else if(total >= 14 && total <= 17 ){
        clan = 'ASAGO CLAN';
    }
    else if(total >= 18 && total <= 21 ){
        clan = 'SAKEDA CLAN';
    }
    else if(total >= 22 && total <= 25 ){
        clan = 'KAJIWARA CLAN';
    }
    else if(total > 25 ){
        clan = 'KAJIWARA CLAN';
    }

    model.User.update(
        { _id: user_id }, { clan }
    ).then(data => {
        console.log("Clan updated successfully",data);
    }).catch((err) => {
        console.log("Error in updating clan", err);
    });
}