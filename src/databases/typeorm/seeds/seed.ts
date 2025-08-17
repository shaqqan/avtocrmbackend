import { config } from 'dotenv';
import dataSource from '../data-source';
import { LanguageSeeder } from './language.seeder';
import { PermissionSeeder } from './permission.seeder';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';
import { AutoBrandSeeder } from './auto-brand.seeder';
import { AutoModelSeeder } from './auto-model.seeder';
import { AutoPositionSeeder } from './auto-position.seeder';
import { AutoColorSeeder } from './auto-color.seeder';
import { WarehouseSeeder } from './warehouse.seeder';
import { StockSeeder } from './stock.seeder';
import { CustomerSeeder } from './customer.seeder';
import { OrderSeeder } from './order.seeder';
import { PriceListSeeder } from './price-list.seeder';

config();
async function seed() {
  try {
    await dataSource.initialize();

    // const languageSeeder = new LanguageSeeder(dataSource);
    // await languageSeeder.seed();

    const permissionSeeder = new PermissionSeeder(dataSource);
    await permissionSeeder.seed();

    const roleSeeder = new RoleSeeder(dataSource);
    await roleSeeder.seed();

    const userSeeder = new UserSeeder(dataSource);
    await userSeeder.seed();

    // const autoBrandSeeder = new AutoBrandSeeder(dataSource);
    // await autoBrandSeeder.seed();

    // const autoModelSeeder = new AutoModelSeeder(dataSource);
    // await autoModelSeeder.seed();

    // const autoPositionSeeder = new AutoPositionSeeder(dataSource);
    // await autoPositionSeeder.seed();

    // const autoColorSeeder = new AutoColorSeeder(dataSource);
    // await autoColorSeeder.seed();

    // const warehouseSeeder = new WarehouseSeeder(dataSource);
    // await warehouseSeeder.seed();

    // const stockSeeder = new StockSeeder(dataSource);
    // await stockSeeder.seed();

    // const customerSeeder = new CustomerSeeder(dataSource);
    // await customerSeeder.seed();

    // const orderSeeder = new OrderSeeder(dataSource);
    // await orderSeeder.seed();

    // const priceListSeeder = new PriceListSeeder(dataSource);
    // await priceListSeeder.seed();
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
    process.exit(0);
  }
}

seed();
