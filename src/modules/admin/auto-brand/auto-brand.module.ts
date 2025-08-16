import { Module } from '@nestjs/common';
import { AutoBrandService } from './auto-brand.service';
import { AutoBrandController } from './auto-brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoBrand } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AutoBrand])],
  controllers: [AutoBrandController],
  providers: [AutoBrandService],
  exports: [AutoBrandService],
})
export class AutoBrandModule {}
