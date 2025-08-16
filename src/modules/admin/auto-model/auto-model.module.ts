import { Module } from '@nestjs/common';
import { AutoModelService } from './auto-model.service';
import { AutoModelController } from './auto-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoModels, AutoBrand } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AutoModels, AutoBrand])],
  controllers: [AutoModelController],
  providers: [AutoModelService],
  exports: [AutoModelService],
})
export class AutoModelModule {}
