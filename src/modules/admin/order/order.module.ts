import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Customer, AutoModels, AutoPosition, AutoColor } from 'src/databases/typeorm/entities';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Customer, AutoModels, AutoPosition, AutoColor])],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule { }
