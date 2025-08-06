import { FileCategory, FileFormat } from 'src/common/enums';

export interface IValidationRule {
  allowedMimeTypes: string[];
  maxFileSize: number;
  allowedExtensions: string[];
}

export interface IValidationConfig {
  [key: string]: IValidationRule;
}

export interface IFileValidationService {
  /**
   * Validate file against category rules
   */
  validateFile(
    mimetype: string,
    size: number,
    filename: string,
    category: FileCategory,
    format: FileFormat,
  ): Promise<void>;

  /**
   * Get validation rules for category
   */
  getValidationRules(category: FileCategory): IValidationRule;

  /**
   * Check if file extension matches format
   */
  validateFormatExtension(filename: string, format: FileFormat): boolean;
}
