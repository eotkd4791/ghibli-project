import 'reflect-metadata';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import redis from './redis/redis-client';
import { createDB } from './db/db-client';
import createApolloServer from './apollo/createApolloServer';
import { verifyAccessTokenFromReqHeaders } from './utils/jwt-auth';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

async function main() {
  await createDB();

  app.use(cookieParser());

  const apolloServer = await createApolloServer(httpServer);
  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        const verifiedUser = verifyAccessTokenFromReqHeaders(req.headers);
        return {
          req,
          res,
          verifiedUser,
          redis,
        };
      },
    }),
  );

  httpServer.listen(process.env.PORT || 4000, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`
      server started on => http://localhost:4000
      apollo studio => http://localhost:4000/graphql
      `);
    } else {
      console.log(`
      Production server Started...
      `);
    }
  });
}

main().catch(console.error);
