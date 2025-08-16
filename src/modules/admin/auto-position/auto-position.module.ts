import { Module } from '@nestjs/common';
import { AutoPositionService } from './auto-position.service';
import { AutoPositionController } from './auto-position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoPosition, AutoModels } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AutoPosition, AutoModels])],
  controllers: [AutoPositionController],
  providers: [AutoPositionService], 
  exports: [AutoPositionService],
})
export class AutoPositionModule {}
