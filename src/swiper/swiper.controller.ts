import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { SwiperService } from './swiper.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('swiper')
export class SwiperController {
  constructor(private readonly swiperService: SwiperService) {}
  // 上传文件（图片）
  @Post('uoload')
  @UseInterceptors(FilesInterceptor('files', 9))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log('文件数据', files);
  }
  // 添加BANNER
  @Post('add')
  @UseInterceptors(FilesInterceptor('files', 9))
  create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    // console.log(files,body);
    let formData = JSON.parse(body.formData);
    let news_title = formData['news_title'];
    let news_content = formData['news_content'];
    console.log("表单数据",body,"文件",files);
    let Images = files.map(
      (item) => `${process.env.ADDRESS}swiper/${item.filename}`,
    );
    let fileName = files.map((item) => item.filename);
    return this.swiperService.addNews(
      { news_title, news_content },
      Images,
      fileName,
    );
  }
  // 编辑BANNER
  @Post('editBanner')
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
      (item) => `${process.env.ADDRESS}swiper/${item.filename}`,
    );
    // 旧图片
    let oldImages = images.map(path => path.url ? path.url : path)
    return this.swiperService.updateNews(
      { news_title, news_content, images, id },
      Images,oldImages
    );
  }
  // 获取所有BANNER
  @Get('getBanner')
  getNews(@Query() query) {
    return this.swiperService.getNewsList(query);
  }
  // 删除BANNER
  @Post('delBanner')
  delNews(@Body() body) {
    let {id} = body
    return this.swiperService.deleteNews(id)
  }
  // 获取所有BANNER数据条数
  @Get('getBannerCount')
  getNewsCount() {
    return this.swiperService.getNewsCount();
  }

}
