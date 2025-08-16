import { DataSource } from 'typeorm';
import { AutoPosition, AutoModels } from '../entities';

export class AutoPositionSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    // Get all auto models first
    const autoModels = await this.dataSource.manager.find(AutoModels);
    
    if (autoModels.length === 0) {
      console.log('⚠️  No auto models found. Please run auto-model seeder first.');
      return;
    }

    // Get some specific models for different types of positions
    const toyotaCamry = autoModels.find(m => m.name === 'Camry' && m.brand?.name === 'Toyota');
    const hondaCivic = autoModels.find(m => m.name === 'Civic' && m.brand?.name === 'Honda');
    const bmw3Series = autoModels.find(m => m.name === '3 Series' && m.brand?.name === 'BMW');
    const mercedesCClass = autoModels.find(m => m.name === 'C-Class' && m.brand?.name === 'Mercedes-Benz');

    const positionsData = [
      // Toyota Camry Positions
      ...(toyotaCamry ? [
        { name: 'Front Left', autoModelId: toyotaCamry.id },
        { name: 'Front Right', autoModelId: toyotaCamry.id },
        { name: 'Rear Left', autoModelId: toyotaCamry.id },
        { name: 'Rear Right', autoModelId: toyotaCamry.id },
        { name: 'Spare', autoModelId: toyotaCamry.id },
      ] : []),

      // Honda Civic Positions
      ...(hondaCivic ? [
        { name: 'Front Left', autoModelId: hondaCivic.id },
        { name: 'Front Right', autoModelId: hondaCivic.id },
        { name: 'Rear Left', autoModelId: hondaCivic.id },
        { name: 'Rear Right', autoModelId: hondaCivic.id },
        { name: 'Spare', autoModelId: hondaCivic.id },
      ] : []),

      // BMW 3 Series Positions
      ...(bmw3Series ? [
        { name: 'Front Left', autoModelId: bmw3Series.id },
        { name: 'Front Right', autoModelId: bmw3Series.id },
        { name: 'Rear Left', autoModelId: bmw3Series.id },
        { name: 'Rear Right', autoModelId: bmw3Series.id },
        { name: 'Spare', autoModelId: bmw3Series.id },
        { name: 'Front Center', autoModelId: bmw3Series.id },
        { name: 'Rear Center', autoModelId: bmw3Series.id },
      ] : []),

      // Mercedes C-Class Positions
      ...(mercedesCClass ? [
        { name: 'Front Left', autoModelId: mercedesCClass.id },
        { name: 'Front Right', autoModelId: mercedesCClass.id },
        { name: 'Rear Left', autoModelId: mercedesCClass.id },
        { name: 'Rear Right', autoModelId: mercedesCClass.id },
        { name: 'Spare', autoModelId: mercedesCClass.id },
        { name: 'Front Center', autoModelId: mercedesCClass.id },
        { name: 'Rear Center', autoModelId: mercedesCClass.id },
        { name: 'Left Side', autoModelId: mercedesCClass.id },
        { name: 'Right Side', autoModelId: mercedesCClass.id },
      ] : []),

      // Generic positions for other models
      ...autoModels.slice(0, 10).map(model => [
        { name: 'Front Left', autoModelId: model.id },
        { name: 'Front Right', autoModelId: model.id },
        { name: 'Rear Left', autoModelId: model.id },
        { name: 'Rear Right', autoModelId: model.id },
      ]).flat(),
    ];

    // Filter out positions with invalid auto model IDs
    const validPositionsData = positionsData.filter(position => position.autoModelId !== null);

    if (validPositionsData.length === 0) {
      console.log('⚠️  No valid positions data found.');
      return;
    }

    const positions = await this.dataSource.manager.save(AutoPosition, validPositionsData);

    console.log(`✅ ${positions.length} auto positions seeded`);
    return positions;
  }
}
