/**
 * @api {post} /quiz/Add Add Quiz
 * @apiName Add Quiz 
 * @apiGroup Quiz
 * @apiParam {string}   question    Quiz question
 * @apiParam {array}    options     Quiz  question options ( [option 1 ,Option 2 ,Option 3,option 4])
 * @apiParam {string}   answer      Add correct answer ( Option 3);
 * */
exports.AddQuiz = (req, res) => {
    const required_fields = {
        question: 'string',
        answer: 'string',
        options : 'array'
    }
    let params = req.body;
    if (vh.validate(res, required_fields, params)) {
        console.log("here===>");
        model.Quiz.findOneAndUpdate({ question: params.question }, params, {
            new: true,
            upsert: true // Make this update into an upsert
        }).then(data => {
            cres.send(res, data, "Quiz question added successfully");
        }).catch((err) => {
            cres.error(res, "Error in adding quiz question", err);
        });
    }
}

/**
 * @api {get} /quiz/list List Quiz Question
 * @apiName List Quiz Question
 * @apiGroup Quiz
 * */
 exports.ListQuiz = (req, res) => {
    model.Quiz.find({}).then(data => {
        cres.send(res, data, "Quiz list successfully");
    }).catch((err) => {
        cres.error(res, "Error in quiz list", err);
    });
}
