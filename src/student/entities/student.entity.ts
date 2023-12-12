import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {StudentImage} from './studentImage.entity'

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_name: string;

  @Column({type:'text'})
  student_desc: string; 

  @Column()
  release_time: string;

  @Column()
  grade: string;

  @OneToMany(() => StudentImage, studentImage => studentImage.student, { cascade: true })
  studentImage: StudentImage[];
}
