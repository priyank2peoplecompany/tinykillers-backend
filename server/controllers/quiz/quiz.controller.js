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

/**
 * @api {get} /quiz/list List Quiz Question
 * @apiName List Quiz Question
 * @apiGroup Quiz
 * */
exports.checkCode = (req, res) => {
    const required_fields = { code: 'string'}
    let params = req.body;
    if (vh.validate(res, required_fields, params)) {

        //"template":{
        //     "area1": {
        //         "size": ["30","100"],
        //         "bgcolor": "#e11414",
        //         "fitting": "cover",
        //         "position": ["0","0"]
        //     },
        //     "area2": {
        //         "size": ["30","50"],
        //         "bgcolor": "#0fc224",
        //         "fitting": "cover",
        //         "position": ["30","0"]
        //     },
        //     "area3": {
        //         "size": ["30","50"],
        //         "bgcolor": "#071fda",
        //         "fitting": "cover",
        //         "position": ["30","50"]
        //     },
        //     "area4": {
        //         "size": ["40","100"],
        //         "bgcolor": "#f2079c",
        //         "fitting": "cover",
        //         "position": ["60","0"]
        //     }
        // },

        if(params.code == '1234'){
            let data = {
                "id" : 2,
                "name" : "Jack Bravo",
                "playlist_id": 10,
                "playlist_name": "Playlist Name",
                "digital_signage" : true,
                "template":{
                    "area1": {
                        "size": ["100","80" ],
                        "bgcolor": "#ce09c7",
                        "fitting": "cover",
                        "position": ["0","0"]
                    },
                    "area2": {
                        "size": ["100","20"],
                        "bgcolor": "#d1ca05",
                        "fitting": "cover",
                        "position": ["0","80"]
                    }
                },
                "content":[
                    {
                        "media_id": 1,
                        "display_area" : 1,
                        "preview": "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
                        "content": "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
                    },
                    {
                        "media_id": 2,
                        "display_area" : 2,
                        "preview": "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
                        "content": "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
                    },
                    {
                        "media_id": 3,
                        "display_area" : 1,
                        "preview": "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
                        "content": "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
                    },
                    {
                        "media_id": 4,
                        "display_area" : 2,
                        "preview": "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
                        "content": "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
                    },
                    {
                        "media_id": 5,
                        "display_area" : 1,
                        "preview": "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
                        "content": "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
                    },
                ],
                "created_at": "2021-11-11T10:12:14.000000Z",
                "updated_at": "2021-11-11T10:12:14.000000Z",
            };
            cres.send(res, data, "Code verified successfully");
        }
        else{
            cres.error(res, "Please check your code");
        }        
    }
}