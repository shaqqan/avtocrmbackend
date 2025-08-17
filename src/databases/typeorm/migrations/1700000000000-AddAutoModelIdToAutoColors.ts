import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAutoModelIdToAutoColors1700000000000 implements MigrationInterface {
    name = 'AddAutoModelIdToAutoColors1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Add the column as nullable first
        await queryRunner.query(`ALTER TABLE "auto_colors" ADD "autoModelId" integer`);
        
        // Step 2: Update existing records with a default auto model ID
        // You can either:
        // Option A: Set all existing colors to a specific default model
        // await queryRunner.query(`UPDATE "auto_colors" SET "autoModelId" = 1 WHERE "autoModelId" IS NULL`);
        
        // Option B: Set to the first available auto model
        await queryRunner.query(`
            UPDATE "auto_colors" 
            SET "autoModelId" = (
                SELECT id FROM "auto_models" 
                ORDER BY id ASC 
                LIMIT 1
            ) 
            WHERE "autoModelId" IS NULL
        `);
        
        // Step 3: Make the column NOT NULL
        await queryRunner.query(`ALTER TABLE "auto_colors" ALTER COLUMN "autoModelId" SET NOT NULL`);
        
        // Step 4: Add foreign key constraint
        await queryRunner.query(`ALTER TABLE "auto_colors" ADD CONSTRAINT "FK_auto_colors_auto_model" FOREIGN KEY ("autoModelId") REFERENCES "auto_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key constraint
        await queryRunner.query(`ALTER TABLE "auto_colors" DROP CONSTRAINT "FK_auto_colors_auto_model"`);
        
        // Remove the column
        await queryRunner.query(`ALTER TABLE "auto_colors" DROP COLUMN "autoModelId"`);
    }
}
