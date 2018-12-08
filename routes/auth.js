const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const env = dotenv.config();
 
router.post('/', async (req, res) => {

    // validate the body of the request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    //  find the user by username
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).send('Incorrect username.');
    }
 
    // validate credentials by comparing hashes of passwords
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect password.');
    }
 
    const token = jwt.sign({ _id: user._id }, env.parsed['PRIVATE_KEY']);
    res.send(token);
});
 
function validate(user) {
    const schema = {
        username: Joi.string().min(5).required(),
        password: Joi.string().min(8).required()
    };
 
    return Joi.validate(user, schema);
}

module.exports = router;
