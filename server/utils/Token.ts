import jwt from 'jsonwebtoken';

export interface tokenDataProps {
  uniqueID: string;
  fname: string;
  lname: string;
}

export interface verifyTokenProps {
  token: string;
}

export const generateToken = (tokenData: tokenDataProps): string | null => {
  try {
    if (!tokenData || !tokenData.uniqueID || !tokenData.fname || !tokenData.lname) {
      throw new Error('Invalid token data');
    }

    if (typeof process.env.JWT_SECRETKEY !== 'string') {
      throw new Error('JWT Secret Key is not a valid string.');
    }

    const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
    const token = jwt.sign({ ...tokenData, exp: expiration }, process.env.JWT_SECRETKEY);
    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    return null;
  }
}

export const verifyToken = (token: string): false | object => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}