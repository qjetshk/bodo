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
        context: ({ req, res }) => ({ req, res, jwtService }), 
        subscriptions: { 'graphql-ws': true },
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
  ],
  providers: [AppResolver],
})
export class AppModule {}
