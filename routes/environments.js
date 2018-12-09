const { Environment, validate } = require('../models/environment');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

router.post('/', async(req, res) => {

    // validate the body of the request, aka the environment info sent
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error['details'][0]['message']);
    }

    let env = await Environment.findOne({ name: req.body.name });
    if (env) {
        res.status(409).send('Environment already exists')
    } else {
        // insert env in db
        env = new Environment(_.pick(req.body, ['name', 'used_by']));
        await env.save();
        return res.status(200).send(env);
    }

});

module.exports = router;