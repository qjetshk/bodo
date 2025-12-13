import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.getOrThrow<string>('REDIS_URL');

        const redisOptions = {
          retryStrategy: (times: number) => Math.min(times * 100, 2000),
          maxRetriesPerRequest: null,
        };

        return new RedisPubSub({
          publisher: new Redis(redisUrl, redisOptions),
          subscriber: new Redis(redisUrl, redisOptions),
        });
      },
    },
  ],
  exports: [PUB_SUB],
})
export class PubsubModule {}
