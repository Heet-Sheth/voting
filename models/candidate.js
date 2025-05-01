const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    votes: [
        {
            voterId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                requied: true
            },
            voteAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    count: {
        type: Number,
        default: 0
    },
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;