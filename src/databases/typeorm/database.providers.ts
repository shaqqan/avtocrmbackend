import { ConfigService, ConfigType } from '@nestjs/config';
import { TypeormConfig } from 'src/common/configs/typeorm.config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const typeormConfig = configService.getOrThrow<ConfigType<typeof TypeormConfig>>('typeorm');
            const dataSource = new DataSource({
                type: 'postgres',
                host: typeormConfig.host,
                port: typeormConfig.port,
                username: typeormConfig.username,
                password: typeormConfig.password,
                database: typeormConfig.database,
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                subscribers: [
                    __dirname + '/../**/*.subscriber{.ts,.js}',
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
