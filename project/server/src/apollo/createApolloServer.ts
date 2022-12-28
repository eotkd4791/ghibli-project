import http, { IncomingHttpHeaders } from 'http';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { Request, Response } from 'express';
import { JwtVerifiedUesr, DEFAULT_JWT_SECRET_KEY } from '../utils/jwt-auth';
import { FilmResolver } from '../resolvers/Film';
import { CutResolver } from '../resolvers/Cut';
import { UserResolver } from '../resolvers/User';

export interface MyContext {
  req: Request;
  res: Response;
  verifiedUser: JwtVerifiedUesr | null;
}

const createApolloServer = async (
  httpServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >,
) => {
  return new ApolloServer<MyContext>({
    schema: await buildSchema({
      resolvers: [FilmResolver, CutResolver, UserResolver],
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
};

export const verifyAccessToken = (
  accessToken?: string,
): JwtVerifiedUesr | null => {
  if (!accessToken) return null;

  try {
    const verified = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY || DEFAULT_JWT_SECRET_KEY,
    ) as JwtVerifiedUesr;
    return verified;
  } catch (err) {
    console.error('access_token expired: ', err.expiredAt);
    throw new GraphQLError('access token expired');
  }
};

export const verifyAccessTokenFromReqHeaders = (
  headers: IncomingHttpHeaders,
): JwtVerifiedUesr | null => {
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

export default createApolloServer;
