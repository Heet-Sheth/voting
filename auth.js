const person = require('./models/uset');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(async (id, aadhar, done) => {
    try {
        const user = await person.findById(id);
        if (!user || await user.compareAadhar(aadhar)) return done(null, null, { message: 'User not found' });
        return done(null, user);
    } catch (err) {
        console.log(err);
        return done(err, false, { message: 'An error occurred.' });
    }
}));

module.exports = passport;