import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session'
import { join } from 'path';
import * as express from 'express';
import * as history from 'connect-history-api-fallback';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  })
   // 创建一个 express 应用
  // const expressApp = express();
  // 使用 connect-history-api-fallback 中间件
  // expressApp.use(history());
  // app.use(express.static(__dirname+'/static'))
  // 将 express 应用挂载到 NestJS 应用中
  // app.use(expressApp);
  // 全局拦截器
  app.setGlobalPrefix('api/v1');
   // 设置请求体大小限制为50MB
  //  app.use(express.json({ limit: '50mb' }));
  //  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(session({ secret: "XiaoBu", name: "xb.session", rolling: true, cookie: { maxAge: null } }))
  await app.listen(3000, process.env.IP);
}
bootstrap();
