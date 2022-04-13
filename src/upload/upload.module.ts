import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { S3 } from 'aws-sdk';
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
  // providers: [
  //   {
  //     provide: S3,
  //     useFactory: (configService: ConfigService) => {
  //       const { s3 } = configService.get('aws');
  //       console.log(`👉 => file: upload.module.ts => line 25 => s3`, s3);
  //       return new S3({
  //         region: s3.region,
  //         signatureVersion: s3.signatureVersion,
  //         credentials: {
  //           accessKeyId: s3.credentials.accessKeyId,
  //           secretAccessKey: s3.credentials.secretAccessKey,
  //         },
  //       });
  //     },
  //   },
  // ],
  controllers: [MulterController],
})
export class UploadModule {}
