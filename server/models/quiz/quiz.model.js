const QuizSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: JSON,
        required: true,
    },
    answer: {
        type: String,
        required: true,
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

QuizSchema.plugin(mongoose_delete, { deletedBy: false });

const Quiz = mongoose.model('questions', QuizSchema);

module.exports = Quiz;