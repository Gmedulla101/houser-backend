import mongoose from 'mongoose';
import userModel from '../models/User-model';
import jwt from 'jsonwebtoken';
import passportStrategy from 'passport-google-oauth2';
import passport from 'passport';

const GoogleStrategy = passportStrategy.Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:
        'https://houser-backend.onrender.com/api/v1/auth/google/callback',
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const userDetails = {
        username: profile.email,
        fullName: `${profile.given_name} ${profile.famiy_name}`,
        email: profile.email,
        role: 'hunter',
        profilePic: profile.picture,
      };

      const addUserToDb = async () => {
        const existingUser = await userModel.findOne({
          email: userDetails.email,
        });
        if (existingUser) {
          return existingUser;
        } else {
          const newUser = await userModel.create(userDetails);
          return newUser;
        }
      };

      const user = await addUserToDb();

      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15d' }
      );

      return done(null, token);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
