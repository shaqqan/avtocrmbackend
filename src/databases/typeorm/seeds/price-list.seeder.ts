import { DataSource } from 'typeorm';
import { PriceList } from '../entities';

export class PriceListSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    // Get existing entities to reference
    const autoModels = await this.dataSource.manager.find('auto_models', { take: 5 });
    const autoPositions = await this.dataSource.manager.find('auto_positions', { take: 5 });
    const autoColors = await this.dataSource.manager.find('auto_colors', { take: 5 });

    if (autoModels.length === 0 || autoPositions.length === 0 || autoColors.length === 0) {
      console.log('⚠️ Skipping price list seeding - required entities not found');
      return [];
    }

    const priceListsData = [
      {
        autoModelId: autoModels[0].id,
        autoColorId: autoColors[0].id,
        autoPositionId: autoPositions[0].id,
        basePrice: 20000.00,
        wholesalePrice: 22000.00,
        retailPrice: 25000.00,
        vat: 5000.00,
        margin: 3000.00,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
      },
      {
        autoModelId: autoModels[1].id,
        autoColorId: autoColors[1].id,
        autoPositionId: autoPositions[1].id,
        basePrice: 25000.00,
        wholesalePrice: 27500.00,
        retailPrice: 31250.00,
        vat: 6250.00,
        margin: 3750.00,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
      },
      {
        autoModelId: autoModels[2].id,
        autoColorId: autoColors[2].id,
        autoPositionId: autoPositions[2].id,
        basePrice: 30000.00,
        wholesalePrice: 33000.00,
        retailPrice: 37500.00,
        vat: 7500.00,
        margin: 4500.00,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
      },
      {
        autoModelId: autoModels[3].id,
        autoColorId: autoColors[3].id,
        autoPositionId: autoPositions[3].id,
        basePrice: 18000.00,
        wholesalePrice: 19800.00,
        retailPrice: 22500.00,
        vat: 4500.00,
        margin: 2700.00,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: false,
      },
      {
        autoModelId: autoModels[4].id,
        autoColorId: autoColors[4].id,
        autoPositionId: autoPositions[4].id,
        basePrice: 35000.00,
        wholesalePrice: 38500.00,
        retailPrice: 43750.00,
        vat: 8750.00,
        margin: 5250.00,
        validFrom: new Date('2024-01-01'),
        validTo: new Date('2024-12-31'),
        isActive: true,
      },
    ];

    const priceLists = await this.dataSource.manager.save(PriceList, priceListsData);

    console.log(`✅ ${priceLists.length} price lists seeded`);
    return priceLists;
  }
}
