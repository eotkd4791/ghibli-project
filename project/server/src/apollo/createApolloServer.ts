import http, { IncomingHttpHeaders } from 'http';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { Request, Response } from 'express';
import redis from '../redis/redis-client';
import { JwtVerifiedUesr, DEFAULT_JWT_SECRET_KEY } from '../utils/jwt-auth';
import { FilmResolver } from '../resolvers/Film';
import { CutResolver } from '../resolvers/Cut';
import { UserResolver } from '../resolvers/User';

export interface MyContext {
  req: Request;
  res: Response;
  verifiedUser: JwtVerifiedUesr | null;
  redis: typeof redis;
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

export default createApolloServer;
