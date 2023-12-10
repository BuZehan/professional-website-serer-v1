import { Test, TestingModule } from '@nestjs/testing';
import { HonorService } from './honor.service';

describe('HonorService', () => {
  let service: HonorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HonorService],
    }).compile();

    service = module.get<HonorService>(HonorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
