const Skill = require('../models/skill')
const User = require('../models/user')
const Response = require('../services/response')
const constant = require('../services/constant')
const {addUserSkilles} = require('../services/apivalidation')

module.exports = {
    ListSkills: async (req, res) => {
        const skills = await Skill.find();
        return Response.successResponseData(
            res,
            skills,
            constant.SUCCESS,
            res.locals.__('success'),
        )
    },
    AddUserSkills: async (req, res) => {
        const reqParam = req.body;
        addUserSkilles(reqParam, res, async (validate) => {
            if (validate) {
                const response = await User.findOneAndUpdate(
                    { _id: req.user._id }, 
                    { $addToSet: { skill_ids: reqParam.skill_ids } }
                );
                if(!response){
                    return Response.errorResponseWithoutData(
                        res,
                        res.locals.__('userNotFound'),
                        constant.FAIL,
                    )
                }
                return Response.successResponseWithoutData(
                    res,
                    res.locals.__('success'),
                    constant.SUCCESS
                )
            }
        })
    }
}