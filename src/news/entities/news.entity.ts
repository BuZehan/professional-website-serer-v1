import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Image } from './images.entiy';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  news_title: string;

  @Column({ type: 'text' })
  news_content: string;

  @Column()
  release_time: string;

  @Column()
  images_arr: string;

  @OneToMany(() => Image, (image) => image.news, { cascade: true })
  images: Image[];
}
