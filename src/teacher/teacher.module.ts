import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname,join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Teacher } from './entities/teacher.entity';
import { TeacherImage } from './entities/teacherImage.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Teacher,TeacherImage]),MulterModule.register({
    storage:diskStorage({
      destination:join(__dirname,"../../public/teacher"),
      filename:(_,file,callback) => {
        const newUuid = uuidv4();
        const fileName = `${newUuid + extname(file.originalname)}`
        return callback(null,fileName)
     }
    })
  }),],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
