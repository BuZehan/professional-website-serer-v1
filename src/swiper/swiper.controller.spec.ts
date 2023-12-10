import { Test, TestingModule } from '@nestjs/testing';
import { SwiperController } from './swiper.controller';
import { SwiperService } from './swiper.service';

describe('SwiperController', () => {
  let controller: SwiperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwiperController],
      providers: [SwiperService],
    }).compile();

    controller = module.get<SwiperController>(SwiperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
