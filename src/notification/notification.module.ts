import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NewsModule } from 'src/news/news.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationImage } from './entities/notificationImage.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname,join } from 'path';
import { v4 as uuidv4 } from 'uuid';
@Module({
  imports: [NewsModule,TypeOrmModule.forFeature([Notification,NotificationImage]),MulterModule.register({
    storage:diskStorage({
      destination:join(__dirname,"../../public/news"),
      filename:(_,file,callback) => {
        const newUuid = uuidv4();
        const fileName = `${newUuid + extname(file.originalname)}`
        return callback(null,fileName)
     }
    })
  }),],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
