import { Module } from '@nestjs/common';
import { AutoColorService } from './auto-color.service';
import { AutoColorController } from './auto-color.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoColor } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AutoColor])],
  controllers: [AutoColorController],
  providers: [AutoColorService],
  exports: [AutoColorService],
})
export class AutoColorModule {}
