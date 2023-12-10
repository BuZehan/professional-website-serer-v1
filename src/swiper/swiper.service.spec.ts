import { Test, TestingModule } from '@nestjs/testing';
import { SwiperService } from './swiper.service';

describe('SwiperService', () => {
  let service: SwiperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwiperService],
    }).compile();

    service = module.get<SwiperService>(SwiperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
