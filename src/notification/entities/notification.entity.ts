import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NotificationImage } from './notificationImage.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  news_title: string;

  @Column({type:'text'})
  news_content: string;

  @Column()
  release_time: string;

  @Column()
  images_arr: string;

  @OneToMany(() => NotificationImage, notificationImage => notificationImage.notification, { cascade: true })
  notificationImage: NotificationImage[];
}
