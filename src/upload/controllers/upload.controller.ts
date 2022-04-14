import { S3Service } from '@/src/utils/services';
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('local')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './public/tmp',
        filename: (_: any, file: any, cb: any) => {
          cb(null, `${randomUUID()}_${file.originalname}`);
        },
      }),
      limits: {
        files: 10,
        fileSize: 1e7, // set file limit to 100mb
      },
    }),
  )
  uploadFilesToLocal(@UploadedFiles() files: Array<Express.Multer.File>) {
    const data = files.map((file) => {
      const { dest } = this.configService.get('file');
      const folder = `${dest.root}/${dest.tmp}`;

      const originalName = file.originalname;
      const fieldName = file.fieldname;
      const fileType = file.mimetype;
      const fileName = file.filename;
      const filePath = `${folder}/${fileName}`;

      const { host, port, protocol } = this.configService.get('app');
      const url = `${protocol}://${host}:${port}/${dest.tmp}/${fileName}`;
      const server = 'local';
      return {
        fileName,
        filePath,
        fileType,
        fieldName,
        originalName,
        folder,
        url,
        server,
      };
    });

    if (data.length === 1) {
      return data[0];
    }

    return data;
  }

  @Post('s3')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFilesToS3(@UploadedFiles() files: Array<Express.Multer.File>) {
    const { tmpFolder } = this.configService.get('aws.s3');

    let data = await this.s3Service.uploadMany(files, tmpFolder);

    if (data && data.length) {
      data = data.map((el: any) => {
        return {
          fileName: el.file.fileName,
          filePath: `${tmpFolder}/${el.file.fileName}`,
          fileType: el.file.mimetype,
          fieldName: el.file.fieldname,
          originalName: el.file.originalname,
          folder: tmpFolder,
          url: el.Location,
          bucket: el.Bucket,
          server: 'aws/s3',
        };
      });
    }

    if (data.length === 1) {
      return data[0];
    }

    return data;
  }
}
