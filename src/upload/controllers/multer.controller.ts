import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class MulterController {
  constructor(private readonly configService: ConfigService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadSingle(file);
  }

  @Post('files')
  @UseInterceptors(AnyFilesInterceptor())
  uploadMultiFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.uploadMulti(files);
  }

  private uploadSingle(file: any): any {
    return this.uploadMulti([file])[0];
  }

  private uploadMulti(files: any[]): any[] {
    return files.map((file) => {
      const dir = this.configService.get('file.dest.tmp');
      const originalName = file.originalname;
      const fileType = file.mimetype;
      const fileName = file.filename;
      const fieldName = file.fieldname;
      const path = `${dir}/${fileName}`;
      const { host, port, protocol } = this.configService.get('app');
      const fullPath = `${protocol}://${host}:${port}${path}`;
      return {
        fileName,
        fileType,
        fieldName,
        originalName,
        dir,
        path,
        fullPath,
      };
    });
  }
}
