import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import envConfig from '../config/env';
// 👇存储库
import { News } from './news/entities/news.entity';
import { User } from './user/entities/user.entity';
import { Image } from './news/entities/images.entiy';
import { NotificationImage } from './notification/entities/notificationImage.entity';
import { Notification } from './notification/entities/notification.entity';
import { Honor } from './honor/entities/honor.entity';
import { HonorImage } from './honor/entities/honorImage.entity';
//  模块
import { NewsModule } from './news/news.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { HonorModule } from './honor/honor.module';
import { CorsMiddleware } from './middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [News, User, Image, Notification, NotificationImage,Honor,HonorImage], // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', '123456'), // 密码
        database: configService.get('DB_DATABASE', 'network'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    NewsModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    NotificationModule,
    HonorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //   configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CorsMiddleware)
  //     .forRoutes('*'); // 设置需要应用中间件的路由路径，此处为所有路由
  // }
}
