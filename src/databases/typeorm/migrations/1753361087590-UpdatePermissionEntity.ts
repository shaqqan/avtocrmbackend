import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePermissionEntity1753361087590 implements MigrationInterface {
    name = 'UpdatePermissionEntity1753361087590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD \`action\` enum ('create_user', 'read_user', 'update_user', 'delete_user', 'create_role', 'read_role', 'update_role', 'delete_role', 'create_permission', 'read_permission', 'update_permission', 'delete_permission', 'create_language', 'read_language', 'update_language', 'delete_language') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD UNIQUE INDEX \`IDX_1c1e0637ecf1f6401beb9a68ab\` (\`action\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP INDEX \`IDX_1c1e0637ecf1f6401beb9a68ab\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP COLUMN \`action\``);
    }

}
