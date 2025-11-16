import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { isDev } from 'src/utils/is-dev.util';

export async function getGraphQlConfig(configService: ConfigService, jwtSrvice: JwtService): Promise<ApolloDriverConfig> {
  return {
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
    //playground: isDev(configService),
    /* playground: {
      settings: {
        // Needed for auth
        // Docs: https://github.com/prisma/graphql-playground
        ['request.credentials']: 'same-origin',
      }
    }, */
    context: ({ req, res }) => ({ req, res, jwtSrvice }),
    subscriptions: {
      'graphql-ws': true,
    },
  };
}
