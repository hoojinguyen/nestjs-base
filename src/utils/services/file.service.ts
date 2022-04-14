import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class FileService {
  private tmpFolder: string;
  private uploadFolder: string;
  private rootFolder: string;
  private rootPath: string;

  constructor(private readonly config: ConfigService) {
    this.tmpFolder = this.config.get<string>('file.dest.tmp');
    this.uploadFolder = this.config.get<string>('file.dest.uploads');
    this.rootFolder = this.config.get<string>('file.dest.root');
    this.rootPath = this.config.get<string>('file.path');
  }

  public async createFolder(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.mkdir(`${this.rootPath}/${name}`, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  public async moveFile(
    filePath: string,
    folderCurrent?: string,
    folderMove?: string,
  ): Promise<string> {
    const fileName = filePath.split('/').slice(-1);

    if (!folderCurrent) folderCurrent = this.tmpFolder;
    if (!folderMove) folderMove = this.uploadFolder;

    const oldPath = `${this.rootPath}${this.rootFolder}/${folderCurrent}/${fileName}`;
    const newPath = `${this.rootPath}${this.rootFolder}/${folderMove}/${fileName}`;

    return new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, (err) => {
        if (err) reject(err);
        resolve(filePath.replace(folderCurrent, folderMove));
      });
    });
  }

  public async deleteFile(
    filePath: string,
    isCatchError = true,
  ): Promise<boolean> {
    const currentPath = `${this.rootPath}/${filePath}`;
    return new Promise((resolve, reject) => {
      fs.unlink(currentPath, (err) => {
        // when delete a file, may be file is not exist, so you can decide care about it or not (depend of isCatchError)
        if (err && isCatchError) reject(err);
        resolve(true);
      });
    });
  }

  public async deleteFolder(folder: string) {
    const path = `${this.rootPath}/${folder}`;
    const promises: Promise<unknown>[] = [];

    const del = (name: string) => {
      return new Promise((resolve, reject) => {
        fs.unlink(`${path}/${name}`, (err) => {
          if (err) reject(err);
          resolve(name);
        });
      });
    };

    return new Promise((resolve, reject) => {
      fs.readdir(path, (err: Error, files: any[]) => {
        if (err) reject(err);

        files
          .filter((f) => f !== '.gitkeep')
          .map((file) => promises.push(del(file)));

        resolve(Promise.all(promises));
      });
    });
  }
}
