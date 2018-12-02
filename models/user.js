const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
}));

function validateUser(user) {
    const schema = {
        name: Joi.string().required(),
        username: Joi.string().required().min(5),
        password: Joi.string().required().min(8)
    }
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;