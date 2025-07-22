import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LanguageModule } from './language/language.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [AuthModule, LanguageModule, UploadModule],
})
export class AdminModule {}
