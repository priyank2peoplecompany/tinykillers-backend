const UserSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
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