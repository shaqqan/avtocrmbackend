import { Test, TestingModule } from '@nestjs/testing';
import { AudioBookService } from './audio-book.service';

describe('AudioBookService', () => {
  let service: AudioBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioBookService],
    }).compile();

    service = module.get<AudioBookService>(AudioBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
