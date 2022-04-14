import { registerAs } from '@nestjs/config';

export default registerAs('file', () => ({
  dest: {
    root: 'public',
    tmp: 'tmp',
    uploads: 'uploads',
  },
}));
