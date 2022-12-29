import jwt from 'jsonwebtoken';
import { Response } from 'express';
import User from '../entities/User';

export const DEFAULT_JWT_SECRET_KEY = 'secret-key';
export const REFRESH_JWT_SECRET_KEY = 'secret-key2';

export interface JwtVerifiedUesr {
  userId: User['id'];
}

export const createRefreshToken = (user: User) => {
  const userData: JwtVerifiedUesr = { userId: user.id };
  return jwt.sign(
    userData,
    process.env.JWT_REFRESH_SECRET_KEY || REFRESH_JWT_SECRET_KEY,
    { expiresIn: '14d' },
  );
};

export const createAccessToken = (user: User) => {
  const userData: JwtVerifiedUesr = { userId: user.id };
  const accessToken = jwt.sign(
    userData,
    process.env.JWT_SECRET_KEY || DEFAULT_JWT_SECRET_KEY,
    { expiresIn: '30m' },
  );
  return accessToken;
};

export const setRefreshTokenHeader = (res: Response, refreshToken: string) => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};
