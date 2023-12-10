import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { UserService } from 'src/user/user.service';
import { Public } from './decorator/public.decorator';
import { AuthGuard } from './auth.guard';
import * as svgCaptcha from 'svg-captcha';

@Controller('auth')
export class AuthController {
  code: string;
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 登录接口
  @Public()
  @Post('login')
  // SigninUserDto数据验证
  signin(@Request() req, @Body() dto: SigninUserDto) {
    //SigninUserDto 后端校验
    // console.log(dto,dto?.verification,this.code);
    if (
      this.code.toLocaleLowerCase() === dto?.verification?.toLocaleLowerCase()
    ) {
      try {
        let { username, password } = dto;
        return this.authService.signIn(username, password);
      } catch (error) {
        console.log('auth.controller.ts:', error);
      }
    } else {
      return {
        message: '验证码错误，请重试。',
        code: 41,
      };
    }

    // try {
    //   if (
    //     // @ts-ignore
    //     req.session.code.toLocaleLowerCase() === dto?.verification?.toLocaleLowerCase()
    //   ) {

    //   } else {
    //     return {
    //       message: '验证码错误',
    //       code: 400,
    //     };
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }

  // 获取用户信息
  // @Public() //加上此此装饰器，则不校验token
  // @Get('profile')
  // @UseGuards(AuthGuard)
  // getProfile(@Query() query) {
  //   let username = query.username;
  //   return this.userService.findProfile(username);
  // }

  // 验证码
  @Get('/code')
  createCaptcha(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc6655', //背景颜色
    });
    this.code = captcha.text;
    req.session.code = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    // console.log('生产验证码：',captcha.text,this.code);

    res.send({
      message: '验证码获取成功',
      Code: captcha.text,
      code: 200,
      codeSvg: captcha.data,
    });
  }
}
