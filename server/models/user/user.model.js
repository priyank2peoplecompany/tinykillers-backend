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
    quiz_answers:[{
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref:'quiz_question'
        },
        answer:{
            type: Boolean,
            default: false
        }
    }]
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