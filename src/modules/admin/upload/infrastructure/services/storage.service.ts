import { Injectable, Logger } from '@nestjs/common';
import { Readable, Transform } from 'stream';
import { createWriteStream, createReadStream, promises as fs } from 'fs';
import { pipeline } from 'stream/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { IStorageService, IFileMetadata, IStorageResult } from '../../domain/interfaces/storage.interface';

@Injectable()
export class StorageService implements IStorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly baseStoragePath: string;

  constructor() {
    this.baseStoragePath = path.join(process.cwd(), 'storage');
  }

  async storeFile(stream: Readable, metadata: IFileMetadata, storagePath: string): Promise<IStorageResult> {
    const fullDirectory = path.join(this.baseStoragePath, storagePath);
    await this.ensureDirectory(fullDirectory);
    
    const extension = path.extname(metadata.filename);
    const filename = `${uuidv4()}${extension}`;
    const fullPath = path.join(fullDirectory, filename);
    const relativePath = path.join(storagePath, filename);
    
    let actualSize = 0;
    const hash = crypto.createHash('md5');
    
    try {
      const writeStream = createWriteStream(fullPath);
      
      // Create a transform to calculate size and checksum
      const calculateMetrics = new Transform({
        transform(chunk: Buffer, encoding: string, callback: Function) {
          actualSize += chunk.length;
          hash.update(chunk);
          this.push(chunk);
          callback();
        }
      });
      
      // Pipe stream through metrics calculator to file
      stream.pipe(calculateMetrics);
      await pipeline(calculateMetrics, writeStream);
      
      const checksum = hash.digest('hex');
      
      this.logger.log(`File stored successfully: ${relativePath} (${actualSize} bytes, checksum: ${checksum})`);
      
      return {
        path: relativePath,
        size: actualSize,
        checksum
      };
    } catch (error) {
      this.logger.error(`Failed to store file: ${error.message}`, error.stack);
      
      // Cleanup partial file on error
      try {
        await fs.unlink(fullPath);
      } catch (unlinkError) {
        this.logger.warn(`Failed to cleanup partial file: ${unlinkError.message}`);
      }
      
      throw new Error(`File storage failed: ${error.message}`);
    }
  }

  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = path.join(this.baseStoragePath, relativePath);
    
    try {
      await fs.unlink(fullPath);
      this.logger.log(`File deleted successfully: ${relativePath}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
        throw new Error(`File deletion failed: ${error.message}`);
      }
      this.logger.warn(`File not found for deletion: ${relativePath}`);
    }
  }

  async fileExists(relativePath: string): Promise<boolean> {
    const fullPath = path.join(this.baseStoragePath, relativePath);
    
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileSize(relativePath: string): Promise<number> {
    const fullPath = path.join(this.baseStoragePath, relativePath);
    
    try {
      const stats = await fs.stat(fullPath);
      return stats.size;
    } catch (error) {
      this.logger.error(`Failed to get file size: ${error.message}`, error.stack);
      throw new Error(`Unable to get file size: ${error.message}`);
    }
  }

  async ensureDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.mkdir(directoryPath, { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to create directory: ${error.message}`, error.stack);
      throw new Error(`Directory creation failed: ${error.message}`);
    }
  }

  /**
   * Get file stream for reading (useful for serving files)
   */
  getFileStream(relativePath: string): Readable {
    const fullPath = path.join(this.baseStoragePath, relativePath);
    return createReadStream(fullPath);
  }

  /**
   * Get full path for a relative path
   */
  getFullPath(relativePath: string): string {
    return path.join(this.baseStoragePath, relativePath);
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{ totalFiles: number; totalSize: number; availableSpace: number }> {
    try {
      const stats = await this.getDirectoryStats(this.baseStoragePath);
      const diskStats = await fs.statfs(this.baseStoragePath);
      
      return {
        totalFiles: stats.fileCount,
        totalSize: stats.totalSize,
        availableSpace: diskStats.bavail * diskStats.bsize
      };
    } catch (error) {
      this.logger.error(`Failed to get storage stats: ${error.message}`, error.stack);
      throw new Error(`Unable to get storage statistics: ${error.message}`);
    }
  }

  private async getDirectoryStats(directoryPath: string): Promise<{ fileCount: number; totalSize: number }> {
    let fileCount = 0;
    let totalSize = 0;

    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);
      
      if (entry.isDirectory()) {
        const subStats = await this.getDirectoryStats(fullPath);
        fileCount += subStats.fileCount;
        totalSize += subStats.totalSize;
      } else if (entry.isFile()) {
        fileCount++;
        const stats = await fs.stat(fullPath);
        totalSize += stats.size;
      }
    }

    return { fileCount, totalSize };
  }
}