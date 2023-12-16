import { Injectable, NestMiddleware } from '@nestjs/common';
 
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // 在这里配置跨域相关的逻辑
    // const allowedOrigins = ['http://192.168.55.232','http://127.0.0.1:8080']; // 允许的源
    const requestOrigin = req.header('Origin');
    // console.log(requestOrigin);
    
    // if (allowedOrigins.includes(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  
    // }
 
    next();
  }
}