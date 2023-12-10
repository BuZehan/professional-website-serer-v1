import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as svgCaptcha from 'svg-captcha';
@Controller('user')
export class UserController {
  code:string
  constructor(private readonly userService: UserService) {
  }
  // 获取用户信息 返回用户及路由
  // @Post('/getMenu')
  // findAll( @Body() body) {
    
  //   if (this.code.toLocaleLowerCase() === body?.verification?.toLocaleLowerCase()) {
  //     return this.userService.getMenu(body);
  //   } else {
  //     return {
  //       data:{
  //         message: "验证码错误"
  //       },
  //       code:0
  //     }
  //   }
  
  // }
  // 验证码
  // @Get('/code')
  // createCaptcha(@Req() req, @Res() res) {
  //   const captcha = svgCaptcha.create({
  //     size: 4, //生成几个验证码
  //     fontSize: 50, //文字大小
  //     width: 100, //宽度
  //     height: 34, //高度
  //     background: '#cc6655', //背景颜色
  //   });
  //   this.code = captcha.text;
  //   req.session.code = captcha.text; //存储验证码记录到session
  //   res.type('image/svg+xml');
  //   // console.log('生产验证码：',captcha.text,this.code);

  //   res.send({
  //     message: "验证码获取成功",
  //     Code:captcha.text,
  //     code:200,
  //     codeSvg:captcha.data
  //   });
  // }
}
