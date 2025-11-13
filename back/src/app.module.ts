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
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: getGraphQlConfig,
      inject: [ConfigService],
      
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
