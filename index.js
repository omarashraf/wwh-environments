const express = require('express');
const app = express();
const dotenv = require('dotenv');
const env = dotenv.config();
const mongoose = require('mongoose');

const users = require('./routes/users');
const auth = require('./routes/auth');

// connection to mlab's db
mongoose.connect(`mongodb://${env.parsed['USER']}:${env.parsed['PASSWORD']}@${env.parsed['DB']}`, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('connected to db');
}, (err) => {
    console.log('ERR --> ', err);
});

// check for private key upon starting
if (!env.parsed['PRIVATE_KEY']) {
    console.log('No private key is set');
    process.exit(1);
}

// testing endpoint
app.get('/', (req, res) => res.send('Hello World!'));

// accept json format
app.use(express.json());

// users router
app.use('/api/users', users);

// auth router
app.use('/api/auth', auth);

// port setting for app to run
const port = env.parsed['PORT'] || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));