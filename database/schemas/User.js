const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
        index: true,
    },
    email: {
        type: String,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        maxlength: 60
    },
    phone: {
        type: String,
        trim: true,
        required: [true, "can't be blank"]
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;