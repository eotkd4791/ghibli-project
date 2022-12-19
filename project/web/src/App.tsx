import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, Box, theme, Text } from '@chakra-ui/react';
import FilmList from './components/film/FilmList';
import { createApolloClient } from './apollo/createApolloClient';

const apolloClient = createApolloClient();

export const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <Box>
        <Text>Ghibli GraphQL</Text>
        <FilmList />
      </Box>
    </ChakraProvider>
  </ApolloProvider>
);
