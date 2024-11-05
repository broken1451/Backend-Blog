import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogApiService } from './blog-api.service';
import { CreateBlogApiDto } from './dto/create-blog-api.dto';
import { UpdateBlogApiDto } from './dto/update-blog-api.dto';

@Controller('blog-api')
export class BlogApiController {
  constructor(private readonly blogApiService: BlogApiService) {}

  @Post()
  create(@Body() createBlogApiDto: CreateBlogApiDto) {
    return this.blogApiService.create(createBlogApiDto);
  }

  @Get()
  findAll() {
    return this.blogApiService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.blogApiService.findOne(id);
  }

  @Get('/search/:term')
  findByTerm(@Param('term') term: string) {
    return this.blogApiService.findByTerm(term);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateBlogApiDto: UpdateBlogApiDto) {
    return this.blogApiService.update(id, updateBlogApiDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.blogApiService.remove(id);
  }
}
