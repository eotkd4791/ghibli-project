import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';
import { createDB } from './db/db-client';
import { FilmResolver } from './resolvers/Film';
import { CutResolver } from './resolvers/Cut';
import { UserResolver } from './resolvers/User';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

async function main() {
  await createDB();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [FilmResolver, CutResolver, UserResolver],
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.token }),
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
