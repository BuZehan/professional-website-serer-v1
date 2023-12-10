import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SwiperImage } from './swiperImage.entiy';

@Entity()
export class Swiper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  news_title: string;

  @Column({ type: 'text' })
  news_content: string;

  @Column()
  release_time: string;

  @OneToMany(() => SwiperImage, (swiperImage) => swiperImage.swiper, { cascade: true })
  swiperImage: SwiperImage[];
}
