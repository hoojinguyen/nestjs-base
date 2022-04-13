import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterController } from './controllers';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { rootPath, dest } = configService.get('file');
        return {
          dest: `${rootPath}/${dest.tmp}`,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [MulterController],
})
export class UploadModule {}
