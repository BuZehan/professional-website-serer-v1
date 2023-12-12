import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {TeacherImage} from './teacherImage.entity'

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacher_name: string;

  @Column({type:'text'})
  teacher_desc: string; 

  @Column()
  release_time: string;

  @Column()
  gender: string;

  @OneToMany(() => TeacherImage, teacherImage => teacherImage.teacher, { cascade: true })
  teacherImage: TeacherImage[];
}
