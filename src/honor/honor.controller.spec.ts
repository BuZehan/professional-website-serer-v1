import { Test, TestingModule } from '@nestjs/testing';
import { HonorController } from './honor.controller';
import { HonorService } from './honor.service';

describe('HonorController', () => {
  let controller: HonorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HonorController],
      providers: [HonorService],
    }).compile();

    controller = module.get<HonorController>(HonorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
