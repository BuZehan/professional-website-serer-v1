import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,private jwtService:JwtService) {}

  // 登录
  async signIn(username, pass):Promise<any> {
    // console.log(username,pass);
    
    const user = await this.userService.findOne(username);
    // const user = await this.userService.findAll(username);
    // 未注册
    if(!user) {
      return {
        message:'该用户未注册，请联系管理员。',
        code:41
      }
    }
    // 密码错误
    if (user.userInfo.user_password !== pass) {
      // throw new UnauthorizedException();
      return {
        message:'密码错误，请联系管理员。',
        code:42
      }
    }
    const payload = { sub: user.userInfo.id, username: user.userInfo.user_name };
    return {
      message:'登录成功！',
      code:200,
      token: await this.jwtService.signAsync(payload),
      routeMenu:user.routeMenu
    };
  }


}
