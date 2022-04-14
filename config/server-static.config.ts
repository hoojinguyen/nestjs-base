import { registerAs } from '@nestjs/config';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';

export default registerAs('server-static', (): ServeStaticModuleOptions[] => [
  {
    rootPath: './',
    exclude: ['/api*'],
  },
]);
