import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../src/databases/typeorm/data-source';

async function updateAutoColorsData() {
  const dataSource = new DataSource(dataSourceOptions);
  
  try {
    await dataSource.initialize();
    console.log('Data Source initialized successfully');

    // Get the first available auto model
    const firstModel = await dataSource.query(`
      SELECT id, name FROM "auto_models" 
      ORDER BY id ASC 
      LIMIT 1
    `);

    if (firstModel.length === 0) {
      console.error('No auto models found in the database');
      return;
    }

    const defaultModelId = firstModel[0].id;
    console.log(`Using default auto model: ${firstModel[0].name} (ID: ${defaultModelId})`);

    // Update all auto colors that don't have autoModelId
    const result = await dataSource.query(`
      UPDATE "auto_colors" 
      SET "autoModelId" = $1 
      WHERE "autoModelId" IS NULL
    `, [defaultModelId]);

    console.log(`Updated ${result.length} auto colors with default model ID: ${defaultModelId}`);

    // Verify the update
    const updatedColors = await dataSource.query(`
      SELECT id, name, "autoModelId" FROM "auto_colors" 
      ORDER BY id ASC
    `);

    console.log('Updated auto colors:');
    updatedColors.forEach((color: any) => {
      console.log(`  ID: ${color.id}, Name: ${color.name}, Model ID: ${color.autoModelId}`);
    });

  } catch (error) {
    console.error('Error updating auto colors data:', error);
  } finally {
    await dataSource.destroy();
    console.log('Data Source destroyed');
  }
}

// Run the script
updateAutoColorsData().catch(console.error);
