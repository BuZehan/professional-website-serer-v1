import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class StudentImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:""})
  url: string;

  @Column({default:0})
  delete: number;

  @Column({default:""})
  image_name: string;

}