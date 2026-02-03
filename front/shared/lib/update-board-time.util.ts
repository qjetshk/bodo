import { ApolloClient } from "@apollo/client";

export const updateBoardTimeCache = (client: ApolloClient, boardId: string) => {
    return client.cache.modify({
        id: client.cache.identify({ __typename: 'Board', id: boardId }),
        fields: {
            updatedAt: () => new Date().toISOString()
        }
    })
}