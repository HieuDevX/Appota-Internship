import * as brcypt from 'bcrypt';
import { BCRYPT_SALT } from '../../config/env-configs';

export const hashPassword = async (password: string) => {
  try {
    const salt = await brcypt.genSalt(Number(BCRYPT_SALT));
    const hash = await brcypt.hash(password, salt);

    return hash;
  } catch (error) {
    throw new Error('Failed to create hash');
  }
};

export const comparePassword = async (password: string, hash: string) => {
  return brcypt.compare(password, hash);
};
