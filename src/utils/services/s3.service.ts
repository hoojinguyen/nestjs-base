import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { randomUUID } from 'crypto';
import { omit } from 'lodash';

@Injectable()
export class S3Service {
  private s3: S3 = undefined;
  private bucket: string = undefined;
  private signedUrlExpiry: any = undefined;
  private tmpFolder: string = undefined;
  private uploadFolder: string = undefined;

  constructor(private readonly config: ConfigService) {
    const { s3, credentials } = this.config.get('aws');

    this.bucket = s3.bucket;
    this.signedUrlExpiry = s3.signedUrlExpiry;
    this.tmpFolder = s3.tmpFolder;
    this.uploadFolder = s3.uploadFolder;

    this.s3 = new S3({
      region: s3.region,
      signatureVersion: s3.signatureVersion,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });
  }

  private getUploadParams(file: any, folder?: string): PutObjectRequest {
    const { originalname, mimetype, buffer } = file;
    const key = `${randomUUID()}_${originalname}`;
    file.fileName = key;

    return {
      Bucket: folder ? `${this.bucket}/${folder}` : this.bucket,
      Key: key,
      Expires: this.signedUrlExpiry,
      ContentType: mimetype,
      Body: buffer,
    };
  }

  public async uploadOne(file: any, folder?: string): Promise<any> {
    const params = this.getUploadParams(file, folder);
    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err: Error, data: any) => {
        if (err) reject(err);
        resolve({ ...data, file: omit(file, ['buffer']) });
      });
    });
  }

  public async uploadMany(files: any[], folder?: string): Promise<any> {
    const promises: Promise<unknown>[] = [];
    const upload = (file: any) => {
      const params = this.getUploadParams(file, folder);
      return new Promise((resolve, reject) => {
        this.s3.upload(params, (err: Error, data: any) => {
          if (err) reject(err);
          resolve({ ...data, file: omit(file, ['buffer']) });
        });
      });
    };

    files.map((file) => promises.push(upload(file)));
    return await Promise.all(promises);
  }

  public deleteFolder(folder: string): Promise<any> {
    const params = {
      Bucket: this.bucket,
      Prefix: folder,
    };

    return new Promise((resolve, reject) => {
      this.s3.listObjects(params, (err: Error, data: any) => {
        if (err) reject(err);
        const objects = data.Contents.map((object) => ({ Key: object.Key }));
        return this.s3.deleteObjects(
          { Bucket: this.bucket, Delete: { Objects: objects, Quiet: true } },
          (error: Error, val: any) => {
            if (error) reject(error);
            if (!error) resolve(val);
          },
        );
      });
    });
  }

  public deleteFile(fileName: string, folder: string): Promise<any> {
    const params = {
      Bucket: this.bucket,
      Key: `${folder}/${fileName}`,
    };

    return new Promise((resolve, reject) => {
      return this.s3.deleteObject(params, (err: Error, data: any) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  public async moveFile(
    filePath: string,
    folderCurrent?: string,
    folderMove?: string,
  ): Promise<any> {
    const fileName = filePath.split('/').slice(-1);

    if (!folderCurrent) folderCurrent = this.tmpFolder;
    if (!folderMove) folderMove = this.uploadFolder;

    const key = `${folderMove}/${fileName}`;
    const copySrc = `${this.bucket}/${folderCurrent}/${fileName}`;

    const params = {
      Bucket: this.bucket,
      Key: key,
      CopySource: copySrc,
    };

    return new Promise((resolve, reject) => {
      this.s3.copyObject(params, (err: Error) => {
        if (err) reject(err);
        return this.s3.deleteObject(
          { Bucket: this.bucket, Key: `${folderCurrent}/${fileName}` },
          (error: Error) => {
            if (error) reject(error);
            resolve(filePath.replace(folderCurrent, folderMove));
          },
        );
      });
    });
  }

  public getFolder(folder: string, delimiter?: string): Promise<any> {
    const params = {
      Bucket: this.bucket,
      Prefix: folder,
      Delimiter: delimiter || '/',
    };

    return new Promise((resolve, reject) => {
      return this.s3.listObjects(params, (err: Error, data: any) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  public createFolder(folderName: string): Promise<any> {
    const params = {
      Bucket: this.bucket,
      Key: `${folderName}/`,
    };

    return new Promise((resolve, reject) => {
      return this.s3.putObject(params, (err: Error, data: any) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  public async listBucker(limit?: number, folderName?: string): Promise<any> {
    const params = {
      Bucket: this.bucket,
      MaxKeys: limit || 0,
      Delimiter: '/',
      Prefix: folderName || '',
    };

    return new Promise((resolve, reject) => {
      return this.s3.listObjects(params, (err: Error, data: any) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  public async resizeImage(
    imgPath: string,
    width: number,
    height: number,
  ): Promise<any> {
    const params = {
      Bucket: this.bucket,
      Key: imgPath,
    };

    return new Promise((resolve, reject) => {
      this.s3.getObject(params, (err: any, data: any) => {
        if (err) return reject(err);

        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const gm = require('gm').subClass({ imageMagick: true });

          return gm(data.Body)
            .resize(width, height)
            .toBuffer((error: Error, buffer: any) => {
              if (err) reject(error);
              resolve(buffer);
            });
        } else {
          return resolve(false);
        }
      });
    });
  }
}
