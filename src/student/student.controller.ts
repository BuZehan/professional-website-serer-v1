import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { StudentImage } from './entities/studentImage.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('stu')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  //TODO 添加学生信息
  @Post('add')
  @UseInterceptors(FilesInterceptor('files', 9))
  create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    // console.log(files,body);
    let formData = JSON.parse(body.formData);
    let student_name = formData['student_name'];
    let student_desc = formData['student_desc'];
    let grade = formData['grade'];
    console.log('表单数据', body, '文件', files);
    let Images = files.map(
      (item) => `${process.env.ADDRESS}student/${item.filename}`,
    );
    let fileName = files.map((item) => item.filename);
    return this.studentService.addStu(
      { student_name, student_desc, grade },
      Images,
      fileName,
    );
  }
  //TODO获取所有新闻
  @Get('getStu')
  getStu(@Query() query) {
    // console.log('获取证书',query);
    return this.studentService.geStuList(query);
  }
  //TODO 编辑新闻
  @Post('editStu')
  @UseInterceptors(FilesInterceptor('files', 9))
  editStu(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    // console.log('表单数据', body, '文件', files);
    let formData = JSON.parse(body.formData);
    let student_name = formData['student_name'];
    let student_desc = formData['student_desc'];
    let grade = formData['grade'];
    let images = formData['images'];
    let id = formData['id'];
    // console.log('前端数据：', { news_title, news_content, images, id },"文件:",files);
    // 新增图片
    let Images = files.map(
      (item) => `${process.env.ADDRESS}student/${item.filename}`,
    );
    // 旧图片
    let oldImages = images.map((path) => (path.url ? path.url : path));
    return this.studentService.updateStu(
      { student_name, student_desc, images, id,grade },
      Images,
      oldImages,
    );
  }
  //TODO 删除新闻
  @Post('delStu')
  delStu(@Body() body) {
    let { id } = body;
    return this.studentService.deleteStu(id);
  }
  //TODO 获取所有新闻数据条数
  @Get('getAlumniCount')
  getStuCount() {
    return this.studentService.getStuCount();
  }
}
