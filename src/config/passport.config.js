import passport from 'passport';
import local from 'passport-local';
import { isValidPassword } from '../utils/bcrypt.js';
import { UserModel } from '../DAO/mongo/models/userModel.js';
import { UserService } from '../services/userService.js';
import GitHubStrategy from 'passport-github2';
import dotenv from "dotenv";

const userService = new UserService();
const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await userService.getUserByIdOrEmail(null, username);
        if (!user) {
          console.log('User Not Found with username (email) ' + username);
          return done(null, false);
        }
        if (!isValidPassword(password, user.password)) {
          console.log('Invalid Password');
          return done(null, false);
        }
        userService.updateUser(user._id, { lastLoginDate: new Date() })
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age, password } = req.body;
          let newUser = {
            email,
            firstName,
            lastName,
            age,
            password,
          };
          let userCreated = await userService.addUser(newUser);
          console.log('User Registration succesful');
          return done(null, userCreated);
        } catch (err) {
          console.log('Error in register' + err);
          return done(err);
        }
      }
    )
  );

  dotenv.config();
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);
          if (!emailDetail) {
            return done(new Error('Invalid email for this user'));
          }
          profile.email = emailDetail.email;
          const user = await userService.getUserByIdOrEmail(null, profile.email);
          if (!user) {
            let newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              password: 'nopass',
            };
            let userCreated = await userService.addUser(newUser);
            console.log('User Registration succesful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (err) {
          console.log('Fail login with github');
          console.log(err);
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
