import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services';

@Controller('upload')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadSingle(file);
  }

  @Post('files')
  @UseInterceptors(AnyFilesInterceptor())
  uploadMultiFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.fileService.uploadMulti(files);
  }
}
