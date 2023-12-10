// 提供一种将路由声明为公共的机制。 为此，我们可以使用 SetMetadata 装饰器工厂函数创建自定义装饰器。
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
