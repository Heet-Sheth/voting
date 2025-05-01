const express = require('express');
const app = express();

const db = require('./db');

require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

const candidateRoute = require('./routes/candidateRoute');
app.use('/candidate', candidateRoute);
const votingRoute = require('./routes/votingRoute');
app.use('/vote', votingRoute);
const profileRoute = require('./routes/profileRoute');
app.use('/profile', profileRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});