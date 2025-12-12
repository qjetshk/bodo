import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { getGraphQlConfig } from './config/graphql.config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { TemplateModule } from './template/template.module';
import { AppResolver } from './app.resolver';
import { PubsubModule } from './pubsub/pubsub.module';
import { UsersModule } from './users (members)/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getJwtConfig } from './config/jwt.config';
import { join } from 'path';
import { isDev } from './utils/is-dev.util';
import { ColumnModule } from './column/column.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      driver: ApolloDriver,
      inject: [ConfigService, JwtService],
      useFactory: async (configService: ConfigService, jwtService: JwtService) => ({
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: isDev(configService) && {
          settings: { 'request.credentials': 'include' },
        },
        context: ({ req, extra }) => {
          if (extra?.user) {
            return { user: extra.user };
          } 

          return { req, jwtService };
        },

        subscriptions: {
          'graphql-ws': {
            onConnect: async (ctx) => {
              const { extra } = ctx;
              console.log(ctx.connectionParams)
              const token = ctx.connectionParams?.Authorization?.replace('Bearer ', '');
              if (!token) {
                console.log('No JWT provided in connectionParams');
                return false; 
              }

              try {
                const payload = await jwtService.verifyAsync(token);
                console.log('WS connected', { user: payload });
                extra.user = payload
                return { user: payload };
              } catch (err) {
                console.log('JWT verification failed:', err.message);
                return false;
              }
            }
          }
        }

      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
      global: true,
    }),
    BoardModule,
    TaskModule,
    TemplateModule,
    PubsubModule,
    UsersModule,
    ColumnModule,
  ],
  providers: [AppResolver],
})
export class AppModule { }
