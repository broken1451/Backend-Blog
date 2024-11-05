import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogApiTags } from './blog-api-tags.entity';

@Entity({
    name: 'blog_api'
})
export class BlogApi {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('text', { unique: false, nullable: false })
    title: string;

    @Column('text', { unique: false, nullable: false })
    content: string;

    @Column('text', { unique: false, nullable: false })
    category: string;

    @Column('jsonb', { nullable: false, default: [] })
    tags: string[];

    @Column('timestamp', { nullable: false, default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'America/Santiago'"  })
    create_at: Date | string;

    @Column('timestamp', { nullable: false, default: () => "CURRENT_TIMESTAMP AT TIME ZONE 'America/Santiago'"  })
    update_at: Date | string;

    @ManyToOne(
        () => BlogApiTags,
        (tags) => tags.tags,
        { nullable: false }
    )
    @JoinColumn({ name: "tagsTypesId" })
    tagsTypes?: BlogApiTags[] | number;

    @BeforeInsert()
    generateRandomNumber() {
        // this.tagsTypes = Math.floor(Math.random() * 30) + 1;
        this.tagsTypes = this.randomIntFromInterval(1, 30);
    }

    @BeforeUpdate()
    generateRandomNumberUpdate() {
        console.log('BeforeUpdate');
        // this.tagsTypes = Math.floor(Math.random() * 30) + 1;
        this.tagsTypes = this.randomIntFromInterval(1, 30);
    }

    randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}
