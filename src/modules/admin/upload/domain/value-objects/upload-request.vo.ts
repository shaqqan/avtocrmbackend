import { FileCategory, FileFormat } from 'src/common/enums';

export class UploadRequestVO {
  constructor(
    public readonly category: FileCategory,
    public readonly format: FileFormat,
    public readonly filename: string,
    public readonly mimetype: string,
    public readonly size: number,
    public readonly encoding?: string,
    public readonly titleUz?: string,
    public readonly titleRu?: string,
    public readonly titleEn?: string,
    public readonly chapter: number = 0,
    public readonly duration: number = 0,
    public readonly lang: string = 'uzb'
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.category) {
      throw new Error('Category is required');
    }
    
    if (!this.format) {
      throw new Error('Format is required');
    }
    
    if (!this.filename || this.filename.trim().length === 0) {
      throw new Error('Filename is required');
    }
    
    if (!this.mimetype) {
      throw new Error('Mimetype is required');
    }
    
    if (this.size <= 0) {
      throw new Error('File size must be greater than 0');
    }
    
    if (this.chapter < 0) {
      throw new Error('Chapter must be non-negative');
    }
    
    if (this.duration < 0) {
      throw new Error('Duration must be non-negative');
    }
    
    if (this.lang && this.lang.length !== 3) {
      throw new Error('Language code must be 3 characters');
    }
  }

  public getStoragePath(): string {
    // Map categories to the new folder structure
    switch (this.category) {
      case FileCategory.EBOOK:
      case FileCategory.BOOKS:
        return this.format === FileFormat.PNG || this.format === FileFormat.JPG || this.format === FileFormat.JPEG 
          ? 'books/cover' 
          : 'books/files';
          
      case FileCategory.AUDIOBOOK:
      case FileCategory.AUDIOBOOKS:
        return this.format === FileFormat.PNG || this.format === FileFormat.JPG || this.format === FileFormat.JPEG 
          ? 'audiobooks/cover' 
          : 'audiobooks/files';
          
      case FileCategory.COVER:
        // For generic covers, default to books/cover (can be extended later with context)
        return 'books/cover';
        
      case FileCategory.AUTHOR_COVER:
        return 'authors/cover';
        
      case FileCategory.GENRE_COVER:
        return 'genres/cover';
        
      case FileCategory.NEWS_IMAGE:
        return 'news/cover';
        
      case FileCategory.LANGUAGE_ICON:
        return 'languages/icon';
        
      default:
        // Fallback to the old structure for unknown categories
        return this.category;
    }
  }

  public getDisplayTitle(language: 'uz' | 'ru' | 'en' = 'uz'): string {
    switch (language) {
      case 'ru':
        return this.titleRu || this.titleUz || this.filename;
      case 'en':
        return this.titleEn || this.titleUz || this.filename;
      default:
        return this.titleUz || this.filename;
    }
  }
}