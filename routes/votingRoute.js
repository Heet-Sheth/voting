const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user');

const { jwtMiddleware } = require('../jwt');

router.use(jwtMiddleware);

const isVoter = async (req, res, next) => {
    const currentUser = await User.findById(req.user.id);
    console.log(currentUser);
    if (currentUser.userType !== 'voter') return res.status(403).send('Forbidden');
    req.user = currentUser;
    next();
};

router.use(isVoter);

// get evm list for current voter
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.status(200).send(candidates.map(candidate => ({ id: candidate.id, name: candidate.name, party: candidate.party })));
        console.log('Ready to accept vote');
    } catch (err) {
        res.status(400).send('Internal Server Error');
        console.log(err);
    }
});

// cast a vote
router.post('/:candidateId', async (req, res) => {
    if (req.user.hasVoted) return res.status(403).send('You have already voted');
    try {
        const candidateId = req.params.candidateId;
        const voterId = req.user.id;
        const candidate = await Candidate.findByIdAndUpdate(candidateId, {
            $push: {
                votes: {
                    voterId: voterId
                }
            },
            $inc: { count: 1 }
        })

        const voter = await User.findByIdAndUpdate(voterId, { hasVoted: true });

        if (!candidate) return res.status(404).send('Candidate not found');

        res.status(200).send('Vote casted successfully');
    }
    catch (err) {
        res.status(400).send('Internal Server Error');
        console.log(err);
    }
});

//get live results
router.get('/result', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        candidates.sort((a, b) => b.count - a.count);
        res.status(200).send(candidates.map(candidate => ({ name: candidate.name, party: candidate.party, votes: candidate.count })));
    } catch (err) {
        res.status(400).send('Internal Server Error');
        console.log(err);
    }
});

module.exports = router;