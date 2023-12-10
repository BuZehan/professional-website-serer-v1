// image.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Swiper } from './swiper.entity';

@Entity()
export class SwiperImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:""})
  image_path: string;

  @Column({default:0})
  delete: number;

  @Column({default:""})
  image_name: string;

  @ManyToOne(() => Swiper, swiper => swiper.swiperImage)
  swiper: Swiper;
}