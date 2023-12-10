import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HonorImage } from './honorImage.entity';

@Entity()
export class Honor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  news_title: string;

  @Column({type:'text'})
  news_content: string;

  @Column()
  release_time: string;

  @Column()
  type: string;

  @OneToMany(() => HonorImage, honorImage => honorImage.honor, { cascade: true })
  honorImage: HonorImage[];
}
