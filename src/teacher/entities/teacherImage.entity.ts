// image.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity()
export class TeacherImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:""})
  image_path: string;

  @Column({default:0})
  delete: number;

  @Column({default:""})
  image_name: string;

  @ManyToOne(() => Teacher, teacher => teacher.teacherImage)
  teacher: Teacher;
}