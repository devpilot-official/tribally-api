import * as crypto from 'crypto';
import { promisify } from 'util';

const asyncRandomBytes = promisify(crypto.randomBytes);

export const asyncRandomString = async (length: number) => {
    const rand = await asyncRandomBytes(Math.ceil(length / 2));
    return rand.toString('hex').slice(0, length);
};

export const statuses = ['not started', 'ongoing', 'finished']