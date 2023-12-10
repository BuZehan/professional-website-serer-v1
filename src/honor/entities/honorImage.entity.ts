// image.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Honor } from './honor.entity';

@Entity()
export class HonorImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:""})
  image_path: string;

  @Column({default:0})
  delete: number;

  @Column({default:""})
  image_name: string;

  @ManyToOne(() => Honor, honor => honor.honorImage)
  honor: Honor;
}