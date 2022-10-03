import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api-eu-central-1.hygraph.com/v2/cl7zpk4b5530t01t72db5btkc/master',
  cache: new InMemoryCache(),
});

export default client;
