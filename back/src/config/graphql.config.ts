import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { isDev } from 'src/utils/is-dev.util';

export async function getGraphQlConfig(configService: ConfigService): Promise<ApolloDriverConfig> {
  return {
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    //playground: isDev(configService),
    playground: {
      settings: {
        // Needed for auth
        // Docs: https://github.com/prisma/graphql-playground
        ['request.credentials']: 'same-origin',
      }
    },
    context: ({ req, res }) => ({ req, res }),
    subscriptions: {
      'graphql-ws': true,
    },
  };
}
