import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname,join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Student } from './entities/student.entity';
import { StudentImage } from './entities/studentImage.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Student,StudentImage]),MulterModule.register({
    storage:diskStorage({
      destination:join(__dirname,"../../public/student"),
      filename:(_,file,callback) => {
        const newUuid = uuidv4();
        const fileName = `${newUuid + extname(file.originalname)}`
        return callback(null,fileName)
     }
    })
  }),],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
