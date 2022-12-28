import 'reflect-metadata';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { createDB } from './db/db-client';
import createApolloServer, {
  verifyAccessTokenFromReqHeaders,
} from './apollo/createApolloServer';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

async function main() {
  await createDB();

  const apolloServer = await createApolloServer(httpServer);
  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => {
        const verifiedUser = verifyAccessTokenFromReqHeaders(req.headers);
        return {
          req,
          res,
          verifiedUser,
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
