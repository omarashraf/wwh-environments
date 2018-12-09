const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Environment = mongoose.model('Environment', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    used_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}));

function validateEnvironment(env) {
    const schema = {
        name: Joi.string().required(),
        used_by: Joi.string()
    }
    return Joi.validate(env, schema);
}

exports.Environment = Environment;
exports.validate = validateEnvironment;