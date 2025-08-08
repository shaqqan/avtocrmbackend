import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('core/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Get('home')
  async getNewsForHomepage() {
    return this.newsService.getNewsForHomepage();
  }
}
