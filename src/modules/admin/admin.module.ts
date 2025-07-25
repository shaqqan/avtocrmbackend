import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LanguageModule } from './language/language.module';
import { UploadModule } from './upload/upload.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard, RolesGuard } from 'src/common/guards';
import { BookModule } from './book/book.module';

@Module({
  imports: [AuthModule, LanguageModule, PermissionModule, RoleModule, UploadModule, BookModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AdminModule { }
