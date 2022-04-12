import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
// import { nanoid } from 'nanoid';
// import { resolve } from 'path';
// import * as stream from 'stream';
// import { promisify } from 'util';

@Injectable()
export class FileService {
  private currentDir: string;
  private newDir: string;
  private rootPath: string;

  constructor(private readonly config: ConfigService) {
    this.currentDir = this.config.get<string>('file.dest.tmp');
    this.newDir = this.config.get<string>('file.dest.uploads');
    this.rootPath = this.config.get<string>('file.rootPath');
  }

  createFolder(name: string) {
    return new Promise((resolve, reject) => {
      fs.mkdir(`${this.rootPath}/${name}`, (err) => {
        if (err) reject(err);
        resolve({});
      });
    });
  }

  uploadSingle(file: any): any {
    return this.uploadMulti([file])[0];
  }

  uploadMulti(files: any[]): any[] {
    return files.map((file) => {
      const dir = this.currentDir;
      const originalName = file.originalname;
      const fileType = file.mimetype;
      const fileName = file.filename;
      const fieldName = file.fieldname;
      const path = `${dir}/${fileName}`;
      const { host, port, protocol } = this.config.get('app');
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

  // async upload(file: any) {
  //   const pipeline = promisify(stream.pipeline);
  //   try {
  //     const dir = '/tmp';
  //     const filename = nanoid();
  //     const path = `${dir}/${filename}`;
  //     const writeStream = fs.createWriteStream(`${this.static}/${path}`);
  //     await pipeline(file.buffer.toString('base64'), writeStream);
  //     return { dir, filename, path };
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }

  async move(filename: string): Promise<string> {
    const oldPath = `${this.rootPath}${this.currentDir}/${filename}`;
    const newPath = `${this.rootPath}${this.newDir}/${filename}`;

    try {
      await new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return `${this.newDir}/${filename}`;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(path: string, isCatchError = true) {
    const currentPath = `${this.rootPath}/${path}`;
    try {
      await new Promise((resolve, reject) => {
        fs.unlink(currentPath, (err) => {
          // when delete a file, may be file is not exist, so you can decide care about it or not (depend of isCatchError)
          if (err && isCatchError) return reject(err);
          resolve(true);
        });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
