import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { FilesInterceptor } from '@nestjs/platform-express';


@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}
  //TODO 添加信息
  @Post('add')
  @UseInterceptors(FilesInterceptor('files', 9))
  create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log("教师信息：",files,body);
    let formData = JSON.parse(body.formData);
    let teacher_name = formData['teacher_name'];
    let teacher_edu_exp = formData['teacher_edu_exp'];
    let teacher_study_exp = formData['teacher_study_exp'];
    let teacher_work_exp = formData['teacher_work_exp'];
    let gender = formData['gender'];
    // console.log('表单数据', body, '文件', files);
    let Images = files.map(
      (item) => `${process.env.ADDRESS}teacher/${item.filename}`,
    );
    let fileName = files.map((item) => item.filename);
    return this.teacherService.addTeacher(
      { teacher_name,teacher_edu_exp, teacher_work_exp,teacher_study_exp, gender },
      Images,
      fileName,
    );
  }
  //TODO获取所有新闻
  @Get('getTeacher')
  getStu(@Query() query) {
    // console.log('获取证书',query);
    return this.teacherService.geTeacherList(query);
  }
  //TODO 编辑
  @Post('editTeacher')
  @UseInterceptors(FilesInterceptor('files', 9))
  editStu(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    // console.log('表单数据', body, '文件', files);
    let formData = JSON.parse(body.formData);
    let teacher_name = formData['teacher_name'];
    let teacher_edu_exp = formData['teacher_edu_exp'];
    let teacher_study_exp = formData['teacher_study_exp'];
    let teacher_work_exp = formData['teacher_work_exp'];
    let gender = formData['gender'];
    let images = formData['images'];
    let id = formData['id'];
    // console.log('前端数据：', { news_title, news_content, images, id },"文件:",files);
    // 新增图片
    let Images = files.map(
      (item) => `${process.env.ADDRESS}teacher/${item.filename}`,
    );
    // 旧图片
    let oldImages = images.map((path) => (path.url ? path.url : path));
    return this.teacherService.updateTeacher(
      {id, teacher_name,teacher_edu_exp, teacher_work_exp,teacher_study_exp, gender },
      Images,
      oldImages,
    );
  }
  //TODO 删除
  @Post('delTeacher')
  delStu(@Body() body) {
    let { id } = body;
    return this.teacherService.deleteTeacher(id);
  }
  //TODO 获取所有数据条数
  @Get('getTeacherCount')
  getStuCount() {
    return this.teacherService.getTeacherCount();
  }
}