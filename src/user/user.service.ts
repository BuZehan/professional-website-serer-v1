import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getMenu(body) {
    let user = await this.userRepository.findOne({
      where: {
        user_name: body.username,
      },
    });
    return UserRoles(user.user_name, user.user_password);
  }
  // 查找用户
  async findOne(user_name) {
    let userInfo = await this.userRepository.findOne({
      where: {
        user_name: user_name,
      },
    });
    console.log(userInfo);
    if(userInfo === null) {
      return null;
    }
    let routeMenu = UserRoles(userInfo.user_name, userInfo.user_password);
    return {
      userInfo,
      routeMenu
    }
  }
  // 查找用户名是否被注册
  async findAll(user_name) {
    return await this.userRepository.findOne({
      where: {
        user_name: user_name,
      },
    });
  }
}

// 判断用户权限 返回路由
function UserRoles(username: string, password: string) {
  if (username === 'admin' && password === 'admin') {
    return {
      code: 20000,
      data: {
        menu: [
          {
            path: 'home',
            name: 'home',
            label: '首页',
            icon: 's-home',
            url: 'Home.vue',
          },
          {
            label: '专业新闻管理',
            icon: 'menu',
            children: [
              {
                path: 'page1',
                name: 'page1',
                label: '新闻动态',
                url: 'zydt.vue',
              },
              {
                path: 'page2',
                name: 'page2',
                label: '通知公告',
                url: 'tzgg.vue',
              },
              {
                path: 'page3',
                name: 'page3',
                label: '获奖证书',
                url: 'hjzs.vue',
              },
            ],
          },
        ],
        message: '获取成功',
      },
    };
  } else if (username === 'xiaoxiao' && password === 'xiaoxiao') {
    return {
      code: 20000,
      data: {
        menu: [
          {
            path: '/home',
            name: 'home',
            label: '首页',
            icon: 's-home',
            url: 'Home.vue',
          },
          {
            path: '/mall',
            name: 'mall',
            label: '商品管理',
            icon: 'video-play',
            url: 'Mall.vue',
          },
        ],
        token: 'moni.token',
        message: '获取成功',
      },
    };
  } else {
    return {
      code: -999,
      data: {
        message: '密码错误',
      },
    };
  }
}
