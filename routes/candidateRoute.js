const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');

const { jwtMiddleware } = require('../jwt');

router.use(jwtMiddleware);

const isAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user.userType !== 'admin') return res.status(403).send('Forbidden');
    next();
};

router.use(isAdmin);

//get list of all candidates with details
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).send(candidates);
    } catch (err) {
        res.status(400).send('Internal Server Error');
        console.log(err);
    }
});

//add a new candidate
router.post('/', async (req, res) => {
    try {
        const userData = new Candidate(req.body);
        const savedUser = await userData.save();
        res.status(200).send(savedUser);
    } catch (err) {
        res.status(400).send('Internal Server Error');
        console.log(err);
    }
});

//edit an existing candidate
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await Candidate.findByIdAndUpdate(req.params.id, req.body);
        if (!updatedUser) {
            res.status(404).send('Candidate not found');
        }
        res.status(200).send('Candidate Updated');
    } catch (error) {
        res.status(400).send('Internal Server Error');
        console.log(err);
    }
});

//delete an existing candidate
router.delete('/:id', async (req, res) => {
    try {
        const updatedUser = await Candidate.findByIdAndDelete(req.params.id);
        if (!updatedUser) {
            res.status(404).send('Candidate not found');
        }
        res.status(200).send('Candidate Deleted');
    } catch (error) {
        res.status(400).send('Internal Server Error');
        console.log(err);
    }
});

module.exports = router;