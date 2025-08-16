import { DataSource } from 'typeorm';
import { Stock, Warehouse, AutoModels, AutoColor, AutoPosition, StockStatus } from '../entities';

export class StockSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    // Get existing entities for relationships
    const warehouses = await this.dataSource.manager.find(Warehouse);
    const autoModels = await this.dataSource.manager.find(AutoModels, { relations: { brand: true } });
    const autoColors = await this.dataSource.manager.find(AutoColor);
    const autoPositions = await this.dataSource.manager.find(AutoPosition);

    if (warehouses.length === 0 || autoModels.length === 0 || autoColors.length === 0 || autoPositions.length === 0) {
      console.log('⚠️  Required entities not found. Please run other seeders first.');
      return;
    }

    const stocksData = [
      // Toyota Camry - Metallic Silver - Front Left
      {
        warehouseId: this.findEntityId(warehouses, 'Main Distribution Center'),
        autoModelId: this.findEntityId(autoModels, 'Camry'),
        autoColorId: this.findEntityId(autoColors, 'Metallic Silver'),
        autoPositionId: this.findEntityId(autoPositions, 'Front Left'),
        bodyNumber: '1HGBH41JXMN109186',
        arrivalDate: new Date('2024-01-15'),
        status: StockStatus.AVAILABLE,
      },
      // Honda Civic - Pearl White - Front Right
      {
        warehouseId: this.findEntityId(warehouses, 'North Regional Warehouse'),
        autoModelId: this.findEntityId(autoModels, 'Civic'),
        autoColorId: this.findEntityId(autoColors, 'Pearl White'),
        autoPositionId: this.findEntityId(autoPositions, 'Front Right'),
        bodyNumber: '2T1BURHE0JC123456',
        arrivalDate: new Date('2024-01-20'),
        status: StockStatus.AVAILABLE,
      },
      // BMW 3 Series - Alpine White - Rear Left
      {
        warehouseId: this.findEntityId(warehouses, 'South Regional Warehouse'),
        autoModelId: this.findEntityId(autoModels, '3 Series'),
        autoColorId: this.findEntityId(autoColors, 'Alpine White'),
        autoPositionId: this.findEntityId(autoPositions, 'Rear Left'),
        bodyNumber: '3VWDX7AJ5DM123456',
        arrivalDate: new Date('2024-01-25'),
        status: StockStatus.RESERVED,
      },
      // Mercedes C-Class - Obsidian Black - Rear Right
      {
        warehouseId: this.findEntityId(warehouses, 'East Regional Warehouse'),
        autoModelId: this.findEntityId(autoModels, 'C-Class'),
        autoColorId: this.findEntityId(autoColors, 'Obsidian Black'),
        autoPositionId: this.findEntityId(autoPositions, 'Rear Right'),
        bodyNumber: '4T1B11HK5JU123456',
        arrivalDate: new Date('2024-01-30'),
        status: StockStatus.AVAILABLE,
      },
      // Toyota Camry - Cosmic Blue - Spare
      {
        warehouseId: this.findEntityId(warehouses, 'West Regional Warehouse'),
        autoModelId: this.findEntityId(autoModels, 'Camry'),
        autoColorId: this.findEntityId(autoColors, 'Cosmic Blue'),
        autoPositionId: this.findEntityId(autoPositions, 'Spare'),
        bodyNumber: '5NPE34AF0FH123456',
        arrivalDate: new Date('2024-02-05'),
        status: StockStatus.AVAILABLE,
      },
      // Honda Civic - Rallye Red - Front Center
      {
        warehouseId: this.findEntityId(warehouses, 'Central Storage Facility'),
        autoModelId: this.findEntityId(autoModels, 'Civic'),
        autoColorId: this.findEntityId(autoColors, 'Rallye Red'),
        autoPositionId: this.findEntityId(autoPositions, 'Front Center'),
        bodyNumber: '6G1ZT51806L123456',
        arrivalDate: new Date('2024-02-10'),
        status: StockStatus.SOLD,
      },
      // BMW 3 Series - Estoril Blue - Rear Center
      {
        warehouseId: this.findEntityId(warehouses, 'Automotive Parts Warehouse'),
        autoModelId: this.findEntityId(autoModels, '3 Series'),
        autoColorId: this.findEntityId(autoColors, 'Estoril Blue'),
        autoPositionId: this.findEntityId(autoPositions, 'Rear Center'),
        bodyNumber: '7FARW2H84BE123456',
        arrivalDate: new Date('2024-02-15'),
        status: StockStatus.AVAILABLE,
      },
      // Mercedes C-Class - Selenite Grey - Left Side
      {
        warehouseId: this.findEntityId(warehouses, 'Electronics Storage'),
        autoModelId: this.findEntityId(autoModels, 'C-Class'),
        autoColorId: this.findEntityId(autoColors, 'Selenite Grey'),
        autoPositionId: this.findEntityId(autoPositions, 'Left Side'),
        bodyNumber: '8XJDF4G25NA123456',
        arrivalDate: new Date('2024-02-20'),
        status: StockStatus.RESERVED,
      },
      // Toyota Camry - Blizzard Pearl - Right Side
      {
        warehouseId: this.findEntityId(warehouses, 'Food & Beverage Warehouse'),
        autoModelId: this.findEntityId(autoModels, 'Camry'),
        autoColorId: this.findEntityId(autoColors, 'Blizzard Pearl'),
        autoPositionId: this.findEntityId(autoPositions, 'Right Side'),
        bodyNumber: '9BWDE21J614123456',
        arrivalDate: new Date('2024-02-25'),
        status: StockStatus.AVAILABLE,
      },
      // Honda Civic - Aegean Blue - Driver Side Front
      {
        warehouseId: this.findEntityId(warehouses, 'Textile Storage Facility'),
        autoModelId: this.findEntityId(autoModels, 'Civic'),
        autoColorId: this.findEntityId(autoColors, 'Aegean Blue'),
        autoPositionId: this.findEntityId(autoPositions, 'Driver Side Front'),
        bodyNumber: '1ZVBP8CF4E5123456',
        arrivalDate: new Date('2024-03-01'),
        status: StockStatus.AVAILABLE,
      },
    ];

    // Filter out stocks with invalid entity IDs and ensure all required fields are present
    const validStocksData = stocksData.filter(stock => 
      stock.warehouseId !== null && 
      stock.autoModelId !== null && 
      stock.autoColorId !== null && 
      stock.autoPositionId !== null
    ).map(stock => ({
      warehouseId: stock.warehouseId!,
      autoModelId: stock.autoModelId!,
      autoColorId: stock.autoColorId!,
      autoPositionId: stock.autoPositionId!,
      bodyNumber: stock.bodyNumber,
      arrivalDate: stock.arrivalDate,
      status: stock.status,
    }));

    if (validStocksData.length === 0) {
      console.log('⚠️  No valid stocks data found.');
      return;
    }

    const stocks = await this.dataSource.manager.save(Stock, validStocksData as any);

    console.log(`✅ ${stocks.length} stock items seeded`);
    return stocks;
  }

  private findEntityId<T extends { id: number; name: string }>(entities: T[], name: string): number | null {
    const entity = entities.find(e => e.name === name);
    return entity ? entity.id : null;
  }
}
