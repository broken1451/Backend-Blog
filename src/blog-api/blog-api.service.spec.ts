import { Test, TestingModule } from '@nestjs/testing';
import { BlogApiService } from './blog-api.service';

describe('BlogApiService', () => {
  let service: BlogApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogApiService],
    }).compile();

    service = module.get<BlogApiService>(BlogApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
