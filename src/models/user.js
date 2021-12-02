const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    Username: {type: String, required: true, unique: true},
    level: {type: Number, required: true},
    password: {type: String, required: true},
    xp: {type: Number, required: true},
    trophies: {type: Number, required: true},
    gold: {type: Number, required: true},
    online: {type:  Boolean, required: true},
    connected: {type: Boolean, required: true},
    skill_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'skill'
    },]
}, { timestamps: true })

const model = mongoose.model('user', UserSchema)

module.exports = model
