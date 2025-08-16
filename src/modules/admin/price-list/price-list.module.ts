import { Module } from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { PriceListController } from './price-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceList, AutoModels, AutoColor, AutoPosition } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PriceList, AutoModels, AutoColor, AutoPosition])],
  controllers: [PriceListController],
  providers: [PriceListService],
  exports: [PriceListService],
})
export class PriceListModule {}
