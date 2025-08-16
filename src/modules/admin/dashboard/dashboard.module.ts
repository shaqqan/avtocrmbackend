import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Order, AutoModels, Stock, Customer } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, AutoModels, Stock, Customer])],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashboardModule {}
