import { ApolloProvider } from '@apollo/client';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { createApolloClient } from './apollo/createApolloClient';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './pages/Main';

const apolloClient = createApolloClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
]);

export const App: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </ApolloProvider>
);
