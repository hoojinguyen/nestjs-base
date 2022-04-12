import { registerAs } from '@nestjs/config';

export default registerAs('file', () => ({
  rootPath: './public',
  dest: {
    tmp: '/tmp',
    uploads: '/uploads',
  },
  exclude: ['/api*'],
}));
