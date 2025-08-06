import { Test, TestingModule } from '@nestjs/testing';
import { AudioBookController } from './audio-book.controller';
import { AudioBookService } from './audio-book.service';

describe('AudioBookController', () => {
  let controller: AudioBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudioBookController],
      providers: [AudioBookService],
    }).compile();

    controller = module.get<AudioBookController>(AudioBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
