import { Readable } from 'stream';

export interface IFileMetadata {
  filename: string;
  mimetype: string;
  size: number;
  encoding: string;
}

export interface IStorageResult {
  path: string;
  size: number;
  checksum?: string;
}

export interface IStorageService {
  /**
   * Store file using stream for memory efficiency
   */
  storeFile(
    stream: Readable,
    metadata: IFileMetadata,
    storagePath: string,
  ): Promise<IStorageResult>;

  /**
   * Delete file from storage
   */
  deleteFile(path: string): Promise<void>;

  /**
   * Check if file exists
   */
  fileExists(path: string): Promise<boolean>;

  /**
   * Get file size
   */
  getFileSize(path: string): Promise<number>;

  /**
   * Ensure directory exists
   */
  ensureDirectory(path: string): Promise<void>;
}
