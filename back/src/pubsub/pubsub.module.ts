import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const PUB_SUB = 'PUB_SUB';

// Фабрика для создания RedisPubSub с reconnect
function createRedisPubSub(redisUrl: string) {
  const redisOptions = {
    retryStrategy: (times: number) => Math.min(times * 100, 2000),
    maxRetriesPerRequest: 1, // Не null, чтобы reconnect работал корректно
  };

  const publisher = new Redis(redisUrl, redisOptions);
  const subscriber = new Redis(redisUrl, redisOptions);

  const pubsub = new RedisPubSub({ publisher, subscriber });

  // Лог на случай, если Redis отключится
  subscriber.on('end', () => {
    console.warn('[PUBSUB] Redis subscriber disconnected. Subscriptions may need to be resubscribed.');
    // В production можно пересоздать pubsub или заставить клиентов переподписаться
  });

  return pubsub;
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.getOrThrow<string>('REDIS_URL');
        // Создаём один singleton RedisPubSub на весь сервер
        const pubsub = createRedisPubSub(redisUrl);

        // Возвращаем минимальный интерфейс для безопасности
        return {
          publish: (...args: Parameters<RedisPubSub['publish']>) => pubsub.publish(...args),
          asyncIterator: (...args: Parameters<RedisPubSub['asyncIterator']>) => pubsub.asyncIterator(...args),
        };
      },
    },
  ],
  exports: [PUB_SUB],
})
export class PubsubModule implements OnModuleDestroy {
  onModuleDestroy() {
    console.log('[PUBSUB] Module destroyed');
  }
}
