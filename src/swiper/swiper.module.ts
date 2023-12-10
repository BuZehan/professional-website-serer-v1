import { Module } from '@nestjs/common';
import { SwiperService } from './swiper.service';
import { SwiperController } from './swiper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swiper } from './entities/swiper.entity';
import { SwiperImage } from './entities/swiperImage.entiy';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname,join } from 'path';
import { v4 as uuidv4 } from 'uuid';
@Module({
  imports: [TypeOrmModule.forFeature([Swiper,SwiperImage]),MulterModule.register({
    storage:diskStorage({
      destination:join(__dirname,"../../public/swiper"),
      filename:(_,file,callback) => {
        const newUuid = uuidv4();
        const fileName = `${newUuid + extname(file.originalname)}`
        return callback(null,fileName)
     }
    })
  }),],
  controllers: [SwiperController],
  providers: [SwiperService],
})
export class SwiperModule {}
