import { GraphQLError } from 'graphql';
import { MiddlewareFn } from 'type-graphql';
import { verifyAccessToken, MyContext } from '../apollo/createApolloServer';

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
