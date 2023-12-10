// image.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { News } from './news.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:""})
  image_path: string;

  @Column({default:0})
  delete: number;

  @Column({default:""})
  image_name: string;

  @ManyToOne(() => News, news => news.images)
  news: News;
}