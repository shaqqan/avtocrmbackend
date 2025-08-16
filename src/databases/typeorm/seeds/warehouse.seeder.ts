import { DataSource } from 'typeorm';
import { Warehouse } from '../entities';

export class WarehouseSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const warehouses = await this.dataSource.manager.save(Warehouse, [
      {
        name: 'Main Distribution Center',
        address: '123 Industrial Blvd, Tashkent, Uzbekistan',
        location: '(41.2995,69.2401)',
      },
      {
        name: 'North Regional Warehouse',
        address: '456 Commerce Street, Samarkand, Uzbekistan',
        location: '(39.6270,66.9749)',
      },
      {
        name: 'South Regional Warehouse',
        address: '789 Business Avenue, Bukhara, Uzbekistan',
        location: '(39.7684,64.4556)',
      },
      {
        name: 'East Regional Warehouse',
        address: '321 Trade Road, Fergana, Uzbekistan',
        location: '(40.3842,71.7843)',
      },
      {
        name: 'West Regional Warehouse',
        address: '654 Market Lane, Urgench, Uzbekistan',
        location: '(41.5503,60.6333)',
      },
      {
        name: 'Central Storage Facility',
        address: '987 Warehouse Drive, Navoiy, Uzbekistan',
        location: '(40.0844,65.3792)',
      },
      {
        name: 'Automotive Parts Warehouse',
        address: '147 Auto Parts Blvd, Tashkent, Uzbekistan',
        location: '(41.3111,69.2797)',
      },
      {
        name: 'Electronics Storage',
        address: '258 Tech Street, Tashkent, Uzbekistan',
        location: '(41.3083,69.2487)',
      },
      {
        name: 'Food & Beverage Warehouse',
        address: '369 Food Court, Tashkent, Uzbekistan',
        location: '(41.2995,69.2401)',
      },
      {
        name: 'Textile Storage Facility',
        address: '741 Fabric Road, Tashkent, Uzbekistan',
        location: '(41.3203,69.2487)',
      },
      {
        name: 'Construction Materials Warehouse',
        address: '852 Building Blvd, Tashkent, Uzbekistan',
        location: '(41.2995,69.2401)',
      },
      {
        name: 'Pharmaceutical Storage',
        address: '963 Medicine Street, Tashkent, Uzbekistan',
        location: '(41.3083,69.2487)',
      },
      {
        name: 'Cold Storage Facility',
        address: '159 Freezer Lane, Tashkent, Uzbekistan',
        location: '(41.2995,69.2401)',
      },
      {
        name: 'Hazardous Materials Storage',
        address: '753 Safety Road, Tashkent, Uzbekistan',
        location: '(41.3203,69.2487)',
      },
      {
        name: 'Express Delivery Hub',
        address: '357 Fast Track, Tashkent, Uzbekistan',
        location: '(41.2995,69.2401)',
      },
    ]);

    console.log(`✅ ${warehouses.length} warehouses seeded`);
    return warehouses;
  }
}
