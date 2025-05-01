const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    userType: {
        type: String,
        default: 'voter',
        enum: ['voter', 'admin']
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    hasVoted: {
        type: Boolean,
        default: false
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('aadhar')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.aadhar = await bcrypt.hash(this.aadhar, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function (aadhar) {
    return await bcrypt.compare(aadhar, this.aadhar);
}

const User = mongoose.model('User', userSchema);
module.exports = User;