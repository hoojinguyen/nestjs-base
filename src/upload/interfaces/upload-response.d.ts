export interface IUploadResponse {
  fileName: string;
  filePath: string;
  fileType: string;
  fieldName: string;
  originalName: string;
  folder: string;
  url: string;
  server: string;
  bucket?: string;
}
