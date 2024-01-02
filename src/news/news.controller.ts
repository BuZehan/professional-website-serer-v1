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
import { NewsService } from './news.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}
  // 上传文件（图片）
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 9))
  async createNewsImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    try {
      // console.log(files);
     return this.newsService.InsertImage(files);
      
    } catch (error) {
      console.log('######Error', error);
      return {
        errno: 1, // 只要不等于 0 就行
        message: '失败信息',
      };
    }
  }
  // 添加新闻
  @Post('add')
  @UseInterceptors(FilesInterceptor('files', 9))
  create(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    // console.log(body, files);
    if (body.editorData) {
      // 富文本添加数据
      let {editorData,title,imageList} = body
      console.log(body);
     return this.newsService.InsertEditorData(editorData,title,imageList);
    }else{
      return{
        code:400,
        message:'未携带参数'
      }
    }
  }
  // 编辑新闻
  @Post('editNews')
  editNews( @Body() body) {
    console.log(body);
    let {id,title,content,imageList} = body
    return this.newsService.updateNews(id,title,content,imageList)
  }
  // 获取所有新闻
  @Get('getNews')
  getNews(@Query() query) {
    return this.newsService.getEditorData(query)
    // return this.newsService.getNewsList(query);
  }
  // 删除新闻
  @Post('delNews')
  delNews(@Body() body) {
    let { id } = body;
    return this.newsService.deleteNews(id);
  }
  // 获取所有新闻数据条数
  @Get('getNewsCount')
  getNewsCount() {
    return this.newsService.getNewsCount();
  }

  // ADD_NEWS( body:any) {
  //   let {editorData,title,imageList} = body
  //   return this.newsService.InsertEditorData(editorData,title,imageList);
  // }
}
