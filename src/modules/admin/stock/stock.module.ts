import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock, Warehouse, AutoModels, AutoColor, AutoPosition } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Warehouse, AutoModels, AutoColor, AutoPosition])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
