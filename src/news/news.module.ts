import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Image } from './entities/images.entiy';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname,join } from 'path';
import { v4 as uuidv4 } from 'uuid';
@Module({
  imports: [TypeOrmModule.forFeature([News,Image]),MulterModule.register({
    storage:diskStorage({
      destination:join(__dirname,"../../public/news"),
      filename:(_,file,callback) => {
        const newUuid = uuidv4();
        const fileName = `${newUuid + extname(file.originalname)}`
        return callback(null,fileName)
     }
    })
  }),],
  controllers: [NewsController],
  providers: [NewsService],
  exports:[NewsService]
})
export class NewsModule {}
