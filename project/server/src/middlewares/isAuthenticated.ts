import { GraphQLError } from 'graphql';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../apollo/createApolloServer';
import { verifyAccessToken } from '../utils/jwt-auth';

export const isAuthenticated: MiddlewareFn<MyContext> = async (
  { context },
  next,
) => {
  const { authorization } = context.req.headers;
  if (!authorization) {
    throw new GraphQLError('unauthenticated');
  }

  const accessToken = authorization.split(' ')[1];
  verifyAccessToken(accessToken);

  if (!context.verifiedUser) {
    throw new GraphQLError('unauthenticated');
  }
  return next();
};
