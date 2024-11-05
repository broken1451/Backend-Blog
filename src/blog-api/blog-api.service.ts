import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBlogApiDto } from './dto/create-blog-api.dto';
import { UpdateBlogApiDto } from './dto/update-blog-api.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogApi } from './entities/blog-api.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';


@Injectable()
export class BlogApiService {

  constructor(@InjectRepository(BlogApi) private readonly blogRepository: Repository<BlogApi>) { }

  /**
   * Creates a new blog entry in the repository.
   *
   * @param {CreateBlogApiDto} createBlogApiDto - The data transfer object containing the details of the blog to be created.
   * @returns {Promise<BlogApi>} A promise that resolves to the newly created blog entry.
   */
  async create(createBlogApiDto: CreateBlogApiDto): Promise<BlogApi> {
    let newBlogApi = this.blogRepository.create(createBlogApiDto);
    const chileTimezone = 'America/Santiago';
    newBlogApi.create_at = new Date(momentTZ.tz(createBlogApiDto.created_at, chileTimezone).format('YYYY-MM-DD HH:mm:ss'));
    newBlogApi.update_at = new Date(momentTZ.tz(createBlogApiDto.created_at, chileTimezone).format('YYYY-MM-DD HH:mm:ss'));
    return this.blogRepository.save(newBlogApi);
  }


  /**
   * Finds blogs by a search term.
   *
   * This method searches for blogs in the repository where the blog title
   * matches the provided term (case-insensitive). If no blogs are found,
   * it throws a `BadRequestException`.
   *
   * @param term - The search term to look for in blog titles.
   * @returns An object containing:
   * - `blogFound`: An array of blogs that match the search term.
   * - `blogCount`: The number of blogs found.
   * - `blogFoundBD`: The total number of blogs in the repository.
   * @throws {BadRequestException} If no blogs are found matching the search term.
   */
  async findByTerm(term: string) {
    const blogFound = await this.blogRepository.createQueryBuilder('blog')
      .where('blog.title ILIKE :term', { term: `%${term.trim()}%` })
      .getMany();

    // const blogFound = await this.blogRepository.find({
    //   where: [
    //     {
    //       title: ILike(`%${term}%`)
    //     }
    //   ]
    // });

    if (blogFound.length === 0) {
      throw new BadRequestException('Blogs not found');
    }

    const blogCount = blogFound.length;
    const blogFoundBD = await this.blogRepository.count({})

    return { blogFound, blogCount, blogFoundBD };
  }


  /**
   * Retrieves all blog entries from the repository.
   *
   * This method fetches all blog entries, including their associated tags.
   * The `relations` option is used to ensure that the `tagsTypes` relation is loaded.
   *
   * @returns {Promise<BlogApi[]>} A promise that resolves to an array of blog entries.
   */
  async findAll(): Promise<BlogApi[]> {
  const blogs = await this.blogRepository.find({
      where: {
        // title: 'Introducción a Python',
        // tagsTypes: {
        //   name: 'Tech'
        // }
      },
      relations: { tagsTypes: true }
    });

    return blogs.map(blog => {
      const formattedBlog = new BlogApi();
      Object.assign(formattedBlog, blog, {
        create_at: moment(blog.create_at).format('YYYY-MM-DD HH:mm:ss'),
        update_at: moment(blog.update_at).format('YYYY-MM-DD HH:mm:ss')
      });
      return formattedBlog;
    });
  }

  // findAll2() {
  //   return this.blogRepository.createQueryBuilder('blogApi')
  //     .leftJoinAndSelect('blogApi.tagsTypes', 'tagsTypes')
  //     .where('blogApi.title = :title', { title: 'Desarrollo Web con React' })
  //     .andWhere('tagsTypes.name = :name', { name: 'Web Development' })
  //     .getMany();
  // }

  /**
   * Finds a single blog entry by its ID.
   * 
   * @param {string} id - The ID of the blog entry to find.
   * @returns {Promise<BlogApi>} The found blog entry.
   * @throws {BadRequestException} If no blog entry is found with the given ID.
   */
  async findOne(id: string): Promise<BlogApi> {

    // const blogApi = await this.blogRepository.findOne({
    //   where: { id: id },
    //   relations: ['tagsTypes']
    // });

    let blogApi = await this.blogRepository.findOne({
      where: { id },
      relations: {
      tagsTypes: true
      }
    });

    if (!blogApi) {
      throw new BadRequestException('Blog not found');
    }
    
    blogApi.create_at = moment(blogApi.create_at).format('YYYY-MM-DD HH:mm:ss');
    blogApi.update_at = moment(blogApi.update_at).format('YYYY-MM-DD HH:mm:ss');

    return blogApi;
  }


  /**
   * Updates a blog entry with the given ID using the provided update data.
   * 
   * @param {string} id - The ID of the blog entry to update.
   * @param {UpdateBlogApiDto} updateBlogApiDto - The data to update the blog entry with.
   * @returns {Promise<BlogApi>} The updated blog entry.
   * 
   * @throws {BadRequestException} If the blog entry with the given ID is not found.
   */
  async update(id: string, updateBlogApiDto: UpdateBlogApiDto): Promise<BlogApi> {
    let blog = await this.findOne(id);
    const blogApi = await this.blogRepository.update(id, updateBlogApiDto);
    if (!blogApi.affected) {
      throw new BadRequestException('Blog not found');
    }


    if (blog) {
      blog.generateRandomNumberUpdate();
      blog.title = updateBlogApiDto.title;
      blog.content = updateBlogApiDto.content;
      blog.category = updateBlogApiDto.category;
      if (updateBlogApiDto?.tags?.length > 0) {
        blog.tags = updateBlogApiDto.tags;
        blog.tags = blog.tags?.filter((item, index) => {
          return blog.tags?.indexOf(item) === index;
        });
      }

      const chileTimezone = 'America/Santiago';
      blog.update_at = new Date(momentTZ.tz(updateBlogApiDto.created_at, chileTimezone).format('YYYY-MM-DD HH:mm:ss'));
      blog = await this.blogRepository.save(blog); // Ahora sí disparará @BeforeUpdate
    }
    return this.findOne(id);;
  }

  /**
   * Removes a blog entry by its ID.
   *
   * This method first attempts to find the blog entry by its ID. If the entry is found,
   * it proceeds to delete the entry from the repository.
   *
   * @param {string} id - The ID of the blog entry to be removed.
   * @returns {Promise<DeleteResult>} A promise that resolves to the result of the deletion operation.
   * @throws {Error} If the blog entry with the specified ID is not found.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);
    const blogDeleted = await this.blogRepository.delete({
      id
    });
    return blogDeleted;
  }
}
