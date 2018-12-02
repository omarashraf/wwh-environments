const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res) => {

    // validate the body of the request, aka the user info sent
    const error = validate(req.body);
    if (error['error']) {
        return res.status(400).send(error['error']['details'][0]['message']);
    }

    // check if the user is already an existent one
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        res.status(409).send('User already exists')
    } else {
        // insert user in db
        user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });
        await user.save();
        return res.send(user);
    }

});

module.exports = router;