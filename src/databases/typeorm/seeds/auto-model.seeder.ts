import { DataSource } from 'typeorm';
import { AutoModels, AutoBrand } from '../entities';

export class AutoModelSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    // Get all brands first
    const brands = await this.dataSource.manager.find(AutoBrand);
    
    if (brands.length === 0) {
      console.log('⚠️  No brands found. Please run auto-brand seeder first.');
      return;
    }

    const modelsData = [
      // Toyota Models
      { name: 'Camry', brandId: this.findBrandId(brands, 'Toyota') },
      { name: 'Corolla', brandId: this.findBrandId(brands, 'Toyota') },
      { name: 'RAV4', brandId: this.findBrandId(brands, 'Toyota') },
      { name: 'Highlander', brandId: this.findBrandId(brands, 'Toyota') },
      { name: 'Tacoma', brandId: this.findBrandId(brands, 'Toyota') },
      { name: 'Tundra', brandId: this.findBrandId(brands, 'Toyota') },
      { name: 'Prius', brandId: this.findBrandId(brands, 'Toyota') },

      // Honda Models
      { name: 'Civic', brandId: this.findBrandId(brands, 'Honda') },
      { name: 'Accord', brandId: this.findBrandId(brands, 'Honda') },
      { name: 'CR-V', brandId: this.findBrandId(brands, 'Honda') },
      { name: 'Pilot', brandId: this.findBrandId(brands, 'Honda') },
      { name: 'HR-V', brandId: this.findBrandId(brands, 'Honda') },
      { name: 'Passport', brandId: this.findBrandId(brands, 'Honda') },

      // Nissan Models
      { name: 'Altima', brandId: this.findBrandId(brands, 'Nissan') },
      { name: 'Sentra', brandId: this.findBrandId(brands, 'Nissan') },
      { name: 'Rogue', brandId: this.findBrandId(brands, 'Nissan') },
      { name: 'Murano', brandId: this.findBrandId(brands, 'Nissan') },
      { name: 'Pathfinder', brandId: this.findBrandId(brands, 'Nissan') },
      { name: 'Frontier', brandId: this.findBrandId(brands, 'Nissan') },

      // BMW Models
      { name: '3 Series', brandId: this.findBrandId(brands, 'BMW') },
      { name: '5 Series', brandId: this.findBrandId(brands, 'BMW') },
      { name: 'X3', brandId: this.findBrandId(brands, 'BMW') },
      { name: 'X5', brandId: this.findBrandId(brands, 'BMW') },
      { name: 'X7', brandId: this.findBrandId(brands, 'BMW') },
      { name: 'i4', brandId: this.findBrandId(brands, 'BMW') },

      // Mercedes-Benz Models
      { name: 'C-Class', brandId: this.findBrandId(brands, 'Mercedes-Benz') },
      { name: 'E-Class', brandId: this.findBrandId(brands, 'Mercedes-Benz') },
      { name: 'S-Class', brandId: this.findBrandId(brands, 'Mercedes-Benz') },
      { name: 'GLC', brandId: this.findBrandId(brands, 'Mercedes-Benz') },
      { name: 'GLE', brandId: this.findBrandId(brands, 'Mercedes-Benz') },
      { name: 'GLS', brandId: this.findBrandId(brands, 'Mercedes-Benz') },

      // Audi Models
      { name: 'A3', brandId: this.findBrandId(brands, 'Audi') },
      { name: 'A4', brandId: this.findBrandId(brands, 'Audi') },
      { name: 'A6', brandId: this.findBrandId(brands, 'Audi') },
      { name: 'Q3', brandId: this.findBrandId(brands, 'Audi') },
      { name: 'Q5', brandId: this.findBrandId(brands, 'Audi') },
      { name: 'Q7', brandId: this.findBrandId(brands, 'Audi') },

      // Volkswagen Models
      { name: 'Golf', brandId: this.findBrandId(brands, 'Volkswagen') },
      { name: 'Passat', brandId: this.findBrandId(brands, 'Volkswagen') },
      { name: 'Tiguan', brandId: this.findBrandId(brands, 'Volkswagen') },
      { name: 'Atlas', brandId: this.findBrandId(brands, 'Volkswagen') },
      { name: 'ID.4', brandId: this.findBrandId(brands, 'Volkswagen') },

      // Ford Models
      { name: 'Focus', brandId: this.findBrandId(brands, 'Ford') },
      { name: 'Fusion', brandId: this.findBrandId(brands, 'Ford') },
      { name: 'Escape', brandId: this.findBrandId(brands, 'Ford') },
      { name: 'Explorer', brandId: this.findBrandId(brands, 'Ford') },
      { name: 'F-150', brandId: this.findBrandId(brands, 'Ford') },
      { name: 'Mustang', brandId: this.findBrandId(brands, 'Ford') },

      // Chevrolet Models
      { name: 'Cruze', brandId: this.findBrandId(brands, 'Chevrolet') },
      { name: 'Malibu', brandId: this.findBrandId(brands, 'Chevrolet') },
      { name: 'Equinox', brandId: this.findBrandId(brands, 'Chevrolet') },
      { name: 'Traverse', brandId: this.findBrandId(brands, 'Chevrolet') },
      { name: 'Silverado', brandId: this.findBrandId(brands, 'Chevrolet') },
      { name: 'Corvette', brandId: this.findBrandId(brands, 'Chevrolet') },

      // Hyundai Models
      { name: 'Elantra', brandId: this.findBrandId(brands, 'Hyundai') },
      { name: 'Sonata', brandId: this.findBrandId(brands, 'Hyundai') },
      { name: 'Tucson', brandId: this.findBrandId(brands, 'Hyundai') },
      { name: 'Santa Fe', brandId: this.findBrandId(brands, 'Hyundai') },
      { name: 'Palisade', brandId: this.findBrandId(brands, 'Hyundai') },
      { name: 'Ioniq', brandId: this.findBrandId(brands, 'Hyundai') },
 
      // Kia Models
      { name: 'Forte', brandId: this.findBrandId(brands, 'Kia') },
      { name: 'K5', brandId: this.findBrandId(brands, 'Kia') },
      { name: 'Sportage', brandId: this.findBrandId(brands, 'Kia') },
      { name: 'Telluride', brandId: this.findBrandId(brands, 'Kia') },
      { name: 'EV6', brandId: this.findBrandId(brands, 'Kia') },

      // Mazda Models
      { name: 'Mazda3', brandId: this.findBrandId(brands, 'Mazda') },
      { name: 'Mazda6', brandId: this.findBrandId(brands, 'Mazda') },
      { name: 'CX-5', brandId: this.findBrandId(brands, 'Mazda') },
      { name: 'CX-9', brandId: this.findBrandId(brands, 'Mazda') },
      { name: 'MX-5 Miata', brandId: this.findBrandId(brands, 'Mazda') },

      // Subaru Models
      { name: 'Impreza', brandId: this.findBrandId(brands, 'Subaru') },
      { name: 'Legacy', brandId: this.findBrandId(brands, 'Subaru') },
      { name: 'Forester', brandId: this.findBrandId(brands, 'Subaru') },
      { name: 'Outback', brandId: this.findBrandId(brands, 'Subaru') },
      { name: 'Crosstrek', brandId: this.findBrandId(brands, 'Subaru') },

      // Lexus Models
      { name: 'ES', brandId: this.findBrandId(brands, 'Lexus') },
      { name: 'IS', brandId: this.findBrandId(brands, 'Lexus') },
      { name: 'LS', brandId: this.findBrandId(brands, 'Lexus') },
      { name: 'RX', brandId: this.findBrandId(brands, 'Lexus') },
      { name: 'NX', brandId: this.findBrandId(brands, 'Lexus') },
      { name: 'GX', brandId: this.findBrandId(brands, 'Lexus') },

      // Infiniti Models
      { name: 'Q50', brandId: this.findBrandId(brands, 'Infiniti') },
      { name: 'Q60', brandId: this.findBrandId(brands, 'Infiniti') },
      { name: 'QX50', brandId: this.findBrandId(brands, 'Infiniti') },
      { name: 'QX60', brandId: this.findBrandId(brands, 'Infiniti') },
      { name: 'QX80', brandId: this.findBrandId(brands, 'Infiniti') },
    ];

    // Filter out models with invalid brand IDs
    const validModelsData = modelsData.filter(model => model.brandId !== null);

    if (validModelsData.length === 0) {
      console.log('⚠️  No valid models data found.');
      return;
    }

    const models = await this.dataSource.manager.save(AutoModels, validModelsData as any);

    console.log(`✅ ${models.length} auto models seeded`);
    return models;
  }

  private findBrandId(brands: AutoBrand[], brandName: string): number | null {
    const brand = brands.find(b => b.name === brandName);
    return brand ? brand.id : null;
  }
}
