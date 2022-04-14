import { registerAs } from '@nestjs/config';

export default registerAs('file', () => ({
  path: './',
  dest: {
    root: 'public',
    tmp: 'tmp',
    uploads: 'uploads',
  },
  exclude: ['/api*'],
}));
