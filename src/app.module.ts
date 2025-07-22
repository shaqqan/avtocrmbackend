import { Module } from '@nestjs/common';
import { ModulesModule } from './modules/modules.module';
import { DatabasesModule } from './databases/databases.module';
import { ConfigModule } from '@nestjs/config';
import { configs } from './common/configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
    }),
    DatabasesModule,
    ModulesModule,
  ],
})
export class AppModule { }
