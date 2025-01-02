const passport = require('passport');
const GoogleStrategy =
  require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new Error(
              'Google profile does not have an email address',
            ),
            null,
          );
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            role: 'user',
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Error in GoogleStrategy:', error);
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
