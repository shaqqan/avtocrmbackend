import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LanguageModule } from './language/language.module';
import { UploadModule } from './upload/upload.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard, RolesGuard } from 'src/common/guards';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { GenresModule } from './genres/genres.module';
import { IssuerModule } from './issuer/issuer.module';
import { NewsModule } from './news/news.module';
import { UserModule } from './user/user.module';
import { HelpModule } from './help/help.module';
import { FeedbacksThemeModule } from './feedbacks-theme/feedbacks-theme.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ReviewBookModule } from './review-book/review-book.module';
import { AudioBookModule } from './audio-book/audio-book.module';
import { ReviewsAudiobookModule } from './reviews-audiobook/reviews-audiobook.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BookAudiobookLinkModule } from './book-audiobook-link/book-audiobook-link.module';

@Module({
  imports: [
    AuthModule,
    LanguageModule,
    PermissionModule,
    RoleModule,
    UploadModule,
    BookModule,
    AuthorModule,
    GenresModule,
    IssuerModule,
    NewsModule,
    UserModule,
    HelpModule,
    FeedbacksThemeModule,
    FeedbackModule,
    ReviewBookModule,
    AudioBookModule,
    ReviewsAudiobookModule,
    DashboardModule,
    BookAudiobookLinkModule,
  ],
  providers: [],
})
export class AdminModule {}
