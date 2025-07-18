import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from 'generated/prisma';
import { RedisService } from 'src/databases/redis/redis.service';

@Injectable()
export class UserListener {
  constructor(private readonly redisService: RedisService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(payload: Partial<User>) {
    console.log(payload);
  }

  @OnEvent('user.updated')
  async handleUserUpdatedEvent(payload: Partial<User>) {
    console.log(payload);
  }

  @OnEvent('user.deleted')
  async handleUserDeletedEvent(payload: Partial<User>) {
    console.log(payload);
  }
}
