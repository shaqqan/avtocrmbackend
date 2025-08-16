import { DataSource } from 'typeorm';
import { AutoBrand } from '../entities';

export class AutoBrandSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const brands = await this.dataSource.manager.save(AutoBrand, [
      {
        name: 'Toyota',
      },
      {
        name: 'Honda',
      },
      {
        name: 'Nissan',
      },
      {
        name: 'BMW',
      },
      {
        name: 'Mercedes-Benz',
      },
      {
        name: 'Audi',
      },
      {
        name: 'Volkswagen',
      },
      {
        name: 'Ford',
      },
      {
        name: 'Chevrolet',
      },
      {
        name: 'Hyundai',
      },
      {
        name: 'Kia',
      },
      {
        name: 'Mazda',
      },
      {
        name: 'Subaru',
      },
      {
        name: 'Lexus',
      },
      {
        name: 'Infiniti',
      },
    ]);

    console.log(`✅ ${brands.length} auto brands seeded`);
    return brands;
  }
}
