import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogApiDto } from './create-blog-api.dto';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBlogApiDto extends PartialType(CreateBlogApiDto) {

    @IsOptional()
    @Type(() => Number)
    updated_at: number;
}
