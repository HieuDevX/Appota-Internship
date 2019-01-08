import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../../../models/user';
import { comparePassword } from '../bcrypt/bcrypt';
import logger from '../log/logger';

export const authenticate = passport.authenticate(
  'local',
  { failureRedirect: '/users/login', failureFlash: 'Invalid username and password' },
);

passport.deserializeUser(async (id: number, done: any) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error('user not found'));
    }
    done(null, user);
  } catch (e) {
    done(e);
  }
});

passport.serializeUser(async (user: IUser, done) => {
  done (null, user.id);
});

passport.use(new LocalStrategy(
  async (username: string, password: string, done) => {
    try {
      const user = await User.find({ username });
      logger.info(`Passport get user by username:`);
      logger.info(`Username: ${username}`);
      logger.info(`User:`);
      console.log(user);
      if (!user) {
        return done(null, false, { message: 'Unknown User'});
      }

      const isMatch = await comparePassword(password, (user as any).password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid Password' });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  },
));
