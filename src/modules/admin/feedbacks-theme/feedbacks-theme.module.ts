import { Module } from '@nestjs/common';
import { FeedbacksThemeService } from './feedbacks-theme.service';
import { FeedbacksThemeController } from './feedbacks-theme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbacksTheme } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbacksTheme])],
  controllers: [FeedbacksThemeController],
  providers: [FeedbacksThemeService],
})
export class FeedbacksThemeModule { }
