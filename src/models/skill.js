const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema({
    name: {type: String, required: true},
}, { timestamps: true })

const model = mongoose.model('skill', SkillSchema)

module.exports = model
