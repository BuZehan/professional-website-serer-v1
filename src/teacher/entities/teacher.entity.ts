import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {TeacherImage} from './teacherImage.entity'
import { formatTimestamp } from 'src/utils';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacher_name: string;

  @Column({type:'text'})
  teacher_edu_exp: string; 

  @Column({type:'text'})
  teacher_study_exp: string; 

  @Column({type:'text'})
  teacher_work_exp: string; 

  @Column({default:formatTimestamp()})
  release_time: string;

  @Column({default:""})
  teacher_position:string

  @Column()
  gender: string;

  @OneToMany(() => TeacherImage, teacherImage => teacherImage.teacher, { cascade: true })
  teacherImage: TeacherImage[];
}
