import { FileCategory, FileFormat } from 'src/common/enums';

export class UploadResultVO {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly originalFilename: string,
    public readonly category: FileCategory,
    public readonly format: FileFormat,
    public readonly size: number,
    public readonly mimetype: string,
    public readonly storagePath: string,
    public readonly titleUz?: string,
    public readonly titleRu?: string,
    public readonly titleEn?: string,
    public readonly chapter: number = 0,
    public readonly duration: number = 0,
    public readonly lang: string = 'uzb',
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly checksum?: string,
  ) {}

  public getPublicUrl(): string {
    if (typeof global.asset === 'function') {
      return global.asset(this.name);
    }
    return this.name;
  }

  public getFileExtension(): string {
    return this.name.split('.').pop()?.toLowerCase() || '';
  }

  public isImage(): boolean {
    const imageFormats = [FileFormat.PNG, FileFormat.JPG, FileFormat.JPEG];
    return imageFormats.includes(this.format);
  }

  public isAudio(): boolean {
    return this.format === FileFormat.MP3;
  }

  public isDocument(): boolean {
    const documentFormats = [FileFormat.PDF, FileFormat.EPUB, FileFormat.FB2];
    return documentFormats.includes(this.format);
  }

  public toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      originalFilename: this.originalFilename,
      category: this.category,
      format: this.format,
      size: this.size,
      mimetype: this.mimetype,
      storagePath: this.storagePath,
      titleUz: this.titleUz,
      titleRu: this.titleRu,
      titleEn: this.titleEn,
      chapter: this.chapter,
      duration: this.duration,
      lang: this.lang,
      isActive: this.isActive,
      createdAt: this.createdAt,
      checksum: this.checksum,
      publicUrl: this.getPublicUrl(),
      fileExtension: this.getFileExtension(),
      isImage: this.isImage(),
      isAudio: this.isAudio(),
      isDocument: this.isDocument(),
    };
  }
}
