const express = require('express');
const router = express.Router();
const { jwtMiddleware, generateToken } = require('../jwt');
const User = require('../models/user');

router.get('/', jwtMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) res.status(401).send('User not found');
        res.status(200).send(currentUser);
    }
    catch (err) {
        res.status(400).send('Internal Server Error');
        console.log(err);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedPerson = await user.save();

        const token = generateToken({ id: savedPerson._id, aadhar: savedPerson.aadhar, userType: savedPerson.userType });

        res.status(200).send({ token: token });
        console.log('Person added');
    } catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
})

router.post('/login', async (req, res) => {
    const { id, aadhar } = req.body;
    try {
        const user = await User.findById(id);
        if (!user || !await user.comparePassword(aadhar)) {
            return res.status(401).send('Invalid username or password');
        }
        const token = generateToken({ id: user._id, aadhar: user.aadhar, userType: user.userType });
        res.status(200).send({ message: 'logged in successfully!', token: token });
        console.log('Person logged in');
    } catch (err) {
        res.status(500).send("Internal Server error:");
        console.log(err);
    }
});

module.exports = router;