import * as mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    index: true,
  },
  password: String,
  email: String,
  name: String,
  profileImage: String,
});

export const User = mongoose.model('Users', UserSchema);

export interface IUser {
  id?: number,
  email: string,
  username: string,
  password: string,
  profileImage: string,
  name: string
}
