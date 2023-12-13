import { Module } from '@nestjs/common';
import { HonorService } from './honor.service';
import { HonorController } from './honor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname,join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Honor } from './entities/honor.entity';
import { HonorImage } from './entities/honorImage.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Honor,HonorImage]),MulterModule.register({
    storage:diskStorage({
      destination:join(__dirname,"../../public/honor"),
      filename:(_,file,callback) => {
        const newUuid = uuidv4();
        const fileName = `${newUuid + extname(file.originalname)}`
        return callback(null,fileName)
     }
    })
  }),],
  controllers: [HonorController,],
  providers: [HonorService],
})
export class HonorModule {}
