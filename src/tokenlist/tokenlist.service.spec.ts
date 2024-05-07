import { Test, TestingModule } from '@nestjs/testing';
import { TokenlistService } from './tokenlist.service';

describe('TokenlistService', () => {
  let service: TokenlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenlistService],
    }).compile();

    service = module.get<TokenlistService>(TokenlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
