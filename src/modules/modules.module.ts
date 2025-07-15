import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [AdminModule, CoreModule]
})
export class ModulesModule { }
