import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const HTTP_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  'https://laughing-space-zebra-r4vr447j5gpjfxqg9-4200.app.github.dev/graphql';

const WS_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ||
  'https://laughing-space-zebra-r4vr447j5gpjfxqg9-4200.app.github.dev/graphql';

const httpLink = new HttpLink({
  uri: HTTP_URL,
  credentials: 'include',
}); 

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: WS_URL,
          connectionParams: () => {
            const token = localStorage.getItem('accessToken');
            return {
              authorization: token ? `Bearer ${token}` : '',
            };
          },
        }),
      )
    : null;

const splitLink =
  typeof window !== 'undefined' && wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === 'OperationDefinition' && def.operation === 'subscription';
        },
        wsLink,
        httpLink,
      )
    : httpLink;

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
