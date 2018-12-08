const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const env = dotenv.config();

router.post('/', async(req, res) => {

    // validate the body of the request, aka the user info sent
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    // check if the user is already an existent one
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        res.status(409).send('User already exists')
    } else {
        // insert user in db
        user = new User(_.pick(req.body, ['name', 'username', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = jwt.sign({ _id: user.id }, env.parsed['PRIVATE_KEY']);
        return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name']));
    }

});

module.exports = router;