import { Module } from '@nestjs/common';
import { BlogApiService } from './blog-api.service';
import { BlogApiController } from './blog-api.controller';
import { BlogApi } from './entities/blog-api.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogApiTags } from './entities/blog-api-tags.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogApi, BlogApiTags]),
  ],
  controllers: [BlogApiController],
  providers: [BlogApiService],
})
export class BlogApiModule {}
