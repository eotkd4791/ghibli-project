import {
  ApolloClient,
  NormalizedCacheObject,
  from,
  fromPromise,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { createApolloCache } from './createApolloCache';
import refreshAccessToken from './auth';
import { createUploadLink } from 'apollo-upload-client';

let apolloClient: ApolloClient<NormalizedCacheObject>;

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      if (graphQLErrors.find((err) => err.message === 'access_token expired')) {
        return fromPromise(refreshAccessToken(apolloClient, operation))
          .filter((result) => !!result)
          .flatMap(() => forward(operation));
      }

      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(`
          [GraphQL error]: -> ${operation.operationName}
          Message: ${message}, Query:${path}, Location:${JSON.stringify(
          locations,
        )}`);
      });
    }

    if (networkError) {
      console.error(`
      [networkError]: -> ${operation.operationName}
      Message: ${networkError.message}
    `);
    }
  },
);

const authLink = setContext((request, prevContext) => {
  const accessToken = localStorage.getItem('access_token');
  return {
    headers: {
      ...prevContext.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const httpUploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
  fetchOptions: 'include',
});

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    cache: createApolloCache(),
    uri: 'http://localhost:4000/graphql',
    link: from([authLink, errorLink, httpUploadLink]),
  });
