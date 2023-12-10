// image.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Notification } from './notification.entity';

@Entity()
export class NotificationImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:""})
  image_path: string;

  @Column({default:0})
  delete: number;

  @Column({default:""})
  image_name: string;

  @ManyToOne(() => Notification, notification => notification.notificationImage)
  notification: Notification;
}