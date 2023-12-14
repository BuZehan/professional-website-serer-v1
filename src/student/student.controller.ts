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
  // 上传文件（图片）
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 9))
  async createNewsImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    try {
      return this.studentService.InsertImage(files);
    } catch (error) {
      console.log('######Error', error);
      return {
        error: 1, // 只要不等于 0 就行
        message: '失败信息',
      };
    }
  }
  // TODO添加
  @Post('add')
  @UseInterceptors(FilesInterceptor('files', 9))
  create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    // console.log(body, files);
    if (body.editorData) {
      // 富文本添加数据
      let { editorData, title, imageList } = body;
      // console.log(body);
      return this.studentService.InsertEditorData(editorData, title, imageList);
    } else {
      return {
        code: 400,
        message: '未携带参数',
      };
    }
  }
  //TODO获取
  @Get('getStu')
  getStu(@Query() query) {
    // console.log('获取数据',query);
    return this.studentService.geStuList(query);
  }
  //TODO编辑
  @Post('editStu')
  editNews(@Body() body) {
    // console.log(body);
    let { id, title, content, imageList } = body;
    return this.studentService.updateNews(id, title, content, imageList);
  }
  //TODO 删除
  @Post('delStu')
  delStu(@Body() body) {
    let { id } = body;
    return this.studentService.deleteStu(id);
  }
  //TODO 获取所有数据条数
  @Get('getAlumniCount')
  getStuCount() {
    return this.studentService.getStuCount();
  }
}
