const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema({
    name: {type: String, required: true},
}, { timestamps: true })

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    password: {type: String, required: true},
    gender: {type: String, required: true},
    image: {type: String, required: true},
    mobile: {type: String, required: true},
    skill: [SkillSchema]
}, { timestamps: true })

const model = mongoose.model('user', UserSchema)

module.exports = model
