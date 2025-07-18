import { Module } from '@nestjs/common';
import { UserListener } from './user.listener';
import { PrismaModule } from 'src/databases/prisma/prisma.module';

@Module({
  providers: [UserListener],
})
export class ListenersModule {}
