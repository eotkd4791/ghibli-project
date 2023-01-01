import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { GraphQLError } from 'graphql';
import { IncomingHttpHeaders } from 'http';
import User from '../entities/User';

export const DEFAULT_JWT_SECRET_KEY = 'secret-key';
export const REFRESH_JWT_SECRET_KEY = 'secret-key2';

export interface JwtVerifiedUser {
  userId: User['id'];
}

export const createRefreshToken = (user: User) => {
  const userData: JwtVerifiedUser = { userId: user.id };
  return jwt.sign(
    userData,
    process.env.JWT_REFRESH_SECRET_KEY || REFRESH_JWT_SECRET_KEY,
    { expiresIn: '14d' },
  );
};

export const createAccessToken = (user: User) => {
  const userData: JwtVerifiedUser = { userId: user.id };
  const accessToken = jwt.sign(
    userData,
    process.env.JWT_SECRET_KEY || DEFAULT_JWT_SECRET_KEY,
    { expiresIn: '30m' },
  );
  return accessToken;
};

export const verifyAccessToken = (
  accessToken?: string,
): JwtVerifiedUser | null => {
  if (!accessToken) return null;

  try {
    const verified = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY || DEFAULT_JWT_SECRET_KEY,
    ) as JwtVerifiedUser;
    return verified;
  } catch (err) {
    console.error('access_token expired: ', err.expiredAt);
    throw new GraphQLError('access token expired');
  }
};

export const verifyAccessTokenFromReqHeaders = (
  headers: IncomingHttpHeaders,
): JwtVerifiedUser | null => {
  const { authorization } = headers;
  if (!authorization) {
    return null;
  }

  const accessToken = authorization.split(' ')[1];
  try {
    return verifyAccessToken(accessToken);
  } catch (err) {
    return null;
  }
};

export const setRefreshTokenHeader = (res: Response, refreshToken: string) => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};
