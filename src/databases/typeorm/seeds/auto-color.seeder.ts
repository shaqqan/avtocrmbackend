import { DataSource } from 'typeorm';
import { AutoColor } from '../entities';

export class AutoColorSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const colors = await this.dataSource.manager.save(AutoColor, [
      { name: 'Metallic Silver' },
      { name: 'Pearl White' },
      { name: 'Alpine White' },
      { name: 'Obsidian Black' },
      { name: 'Cosmic Blue' },
      { name: 'Rallye Red' },
      { name: 'Estoril Blue' },
      { name: 'Selenite Grey' },
      { name: 'Blizzard Pearl' },
      { name: 'Aegean Blue' },
      { name: 'Sunset Orange' },
      { name: 'Forest Green' },
      { name: 'Midnight Purple' },
      { name: 'Champagne Gold' },
      { name: 'Titanium Gray' },
      { name: 'Crystal Blue' },
      { name: 'Ruby Red' },
      { name: 'Emerald Green' },
      { name: 'Sapphire Blue' },
      { name: 'Amber Yellow' },
    ]);

    console.log(`✅ ${colors.length} auto colors seeded`);
    return colors;
  }
}
