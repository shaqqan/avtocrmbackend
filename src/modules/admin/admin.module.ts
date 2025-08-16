import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LanguageModule } from './language/language.module';
import { UploadModule } from './upload/upload.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
import { AutoBrandModule } from './auto-brand/auto-brand.module';
import { AutoModelModule } from './auto-model/auto-model.module';
import { AutoPositionModule } from './auto-position/auto-position.module';
import { AutoColorModule } from './auto-color/auto-color.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { StockModule } from './stock/stock.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { PriceListModule } from './price-list/price-list.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    LanguageModule,
    PermissionModule,
    RoleModule,
    UploadModule,
    UserModule,
    AutoBrandModule,
    AutoModelModule,
    AutoPositionModule,
    AutoColorModule,
    WarehouseModule,
    StockModule,
    CustomerModule,
    OrderModule,
    PriceListModule,
    DashboardModule,
  ],
  providers: [],
})
export class AdminModule {}
