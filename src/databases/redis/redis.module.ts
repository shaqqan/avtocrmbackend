import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis.client.factory';
import { RedisService } from './redis.service';
import { Global } from '@nestjs/common';

@Global()
@Module({
  providers: [redisClientFactory, RedisService],
  exports: [RedisService],
})
export class RedisModule { }