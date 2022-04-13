import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

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

  createFolder(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.mkdir(`${this.rootPath}/${name}`, (err) => {
        if (err) return reject(err);
        return resolve(true);
      });
    });
  }

  async move(filename: string): Promise<string> {
    const oldPath = `${this.rootPath}${this.currentDir}/${filename}`;
    const newPath = `${this.rootPath}${this.newDir}/${filename}`;

    return new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, (err) => {
        if (err) return reject(err);
        return resolve(`${this.newDir}/${filename}`);
      });
    });
  }

  async delete(path: string, isCatchError = true): Promise<boolean> {
    const currentPath = `${this.rootPath}/${path}`;
    return new Promise((resolve, reject) => {
      fs.unlink(currentPath, (err) => {
        // when delete a file, may be file is not exist, so you can decide care about it or not (depend of isCatchError)
        if (err && isCatchError) return reject(err);
        return resolve(true);
      });
    });
  }
}
