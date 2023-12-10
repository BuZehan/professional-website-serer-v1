import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { HonorService } from './honor.service';
@Controller('honor')
export class HonorController {
  constructor(private readonly honor: HonorService) {}
  // 上传文件（图片）
  @Post('uoload')
  @UseInterceptors(FilesInterceptor('files', 9))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log('文件数据', files);
  }
  //TODO 添加新闻
  @Post('add')
  @UseInterceptors(FilesInterceptor('files', 9))
  create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    // console.log(files,body);
    let formData = JSON.parse(body.formData);
    let news_title = formData['news_title'];
    let news_content = formData['news_content'];
    let type = formData['type'];
    console.log("表单数据",body,"文件",files);
    let Images = files.map(
      (item) => `${process.env.ADDRESS}news/${item.filename}`,
    );
    let fileName = files.map((item) => item.filename);
    return this.honor.addNotification(
      { news_title, news_content,type },
      Images,
      fileName,
    );
  }
  // 编辑新闻
  @Post('editHonor')
  @UseInterceptors(FilesInterceptor('files', 9))
  editNews(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    // console.log('表单数据', body, '文件', files);
    let formData = JSON.parse(body.formData);
    let news_title = formData['news_title'];
    let news_content = formData['news_content'];
    let images = formData['images'];
    let id = formData['id'];
    // console.log('前端数据：', { news_title, news_content, images, id },"文件:",files);
    // 新增图片
    let Images = files.map(
      (item) => `${process.env.ADDRESS}news/${item.filename}`,
    );
    // 旧图片
    let oldImages = images.map(path => path.url ? path.url : path)
    return this.honor.updateNotification(
      { news_title, news_content, images, id },
      Images,oldImages
    );
  }
  // 获取所有新闻
  @Get('getHonor')
  getNotification(@Query() query) {
    console.log('获取证书',query);
    
    return this.honor.getNotificationList(query);
  }
  // 删除新闻
  @Post('delHonor')
  delNotification(@Body() body) {
    let {id} = body
    return this.honor.deleteNotification(id)
  }
  // 获取所有新闻数据条数
  @Get('getHonorCount')
  getNotificationCount() {
    return this.honor.getNotificationCount();
  }
}
