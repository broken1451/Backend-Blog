import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogApi } from './blog-api.entity';

@Entity({
    name: 'blog_api_tag' // Cambiar el nombre de la tabla
})
export class BlogApiTags {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('text', { unique: false, nullable: false })
    name: string;

    @Column('text', { unique: false, nullable: false })
    description: string;

    @OneToMany(
        () => BlogApi,
        (tagType) => tagType.tagsTypes
    )
    tags: BlogApi[];

}
