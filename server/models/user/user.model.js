const { Timestamp } = require("mongodb");

const UserSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    address:{
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    clan: {
        type: String,
        default: ''
    },
    total_mint: {
        type: Number,
        default: 0
    },
    quiz_answers:[{
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref:'question'
        },
        answer:{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref:'question'
        }
    }],
    quiz_completed: {
        type: Boolean,
        default: false
    },
    total_point: {
        type: Number,
        default: 0
    },
    last_answer_time: {
        type: Timestamp,
        default: 0
    }    
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    toObject: {
        getters: true
    },
    toJSON: {
        getters: true
    },
}
);

UserSchema.plugin(mongoose_delete, { deletedBy: false });
const User = mongoose.model('users', UserSchema);

module.exports = User;