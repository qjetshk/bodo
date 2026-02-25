import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const HTTP_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  'http://bodo-planner.com/graphql';

const WS_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ||
  'ws://bodo-planner.com/graphql';

const httpLink = new HttpLink({
  uri: HTTP_URL,
  credentials: 'include',
});

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
      createClient({
        url: WS_URL,
        lazy: true,           
        retryAttempts: Infinity, 
        retryWait: async (retries) => {
          await new Promise<void>((resolve) => setTimeout(resolve, 1000));
        },
        connectionParams: () => {
          const token = localStorage.getItem('accessToken');
          return {
            Authorization: token ? `Bearer ${token}` : '',
          };
        },
      }),
    )
    : null;

const splitLink =
  typeof window !== 'undefined' && wsLink
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink,
    )
    : httpLink;

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
