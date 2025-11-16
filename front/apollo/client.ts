import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext, SetContextLink } from '@apollo/client/link/context';
import { createClient } from 'graphql-ws';

// 🌍 Адреса твоего бэка
const HTTP_URL =
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    'https://laughing-space-zebra-r4vr447j5gpjfxqg9-4200.app.github.dev/graphql';
const WS_URL =
    process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ||
    'https://laughing-space-zebra-r4vr447j5gpjfxqg9-4200.app.github.dev/graphql';

// ✅ 1. HTTP линк (для query и mutation)
const httpLink = new HttpLink({
    uri: HTTP_URL,
    credentials: 'include', // чтобы куки передавались
});

// ✅ 2. Auth линк — добавляем токен в headers
const authLink = new SetContextLink(({ headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("accessToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// ✅ 3. WebSocket линк (для subscriptions)
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
        : null; // на сервере ws не нужен

// ✅ 4. Split — делим транспорт: WS для subscriptions, HTTP для остального
const splitLink =
    typeof window !== 'undefined' && wsLink
        ? split(
            ({ query }) => {
                const def = getMainDefinition(query);
                return (
                    def.kind === 'OperationDefinition' &&
                    def.operation === 'subscription'
                );
            },
            wsLink,
            authLink.concat(httpLink),
        )
        : authLink.concat(httpLink);

// ✅ 5. Apollo Client
export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    
});
