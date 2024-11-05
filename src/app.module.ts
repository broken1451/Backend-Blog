import { Module } from '@nestjs/common';
import { BlogApiModule } from './blog-api/blog-api.module';
import { ConfigModule } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    BlogApiModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod' ? true : false, // para conectase de modo seguro con ssl,
      extra: {
        ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null, // para conectase de modo seguro con ssl
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true, // para q carge automaticamente las entidades q se van definiendo poco a poco
      synchronize: true, // cuando ocurre algun cambio en las entidades automticamente lo sincroniza
    
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
