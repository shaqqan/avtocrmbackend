import { File } from "src/databases/typeorm/entities";
import { UploadResponseDto } from "../dto/response/upload.res.dto";
import { UploadFileDto } from "../dto/request/upload-file.dto";
import { UpdateUploadDto } from "../dto/request/update-upload.dto";
import { UploadResultVO } from "../domain/value-objects/upload-result.vo";
import { UploadRequestVO } from "../domain/value-objects/upload-request.vo";
import { I18nContext } from "nestjs-i18n";

export class UploadMapper {
    /**
     * Map database entity to response DTO
     */
    static toDto(entity: File, originalFilename?: string, mimetype?: string, checksum?: string): UploadResponseDto {
        const vo = new UploadResultVO(
            entity.id,
            entity.name,
            originalFilename || entity.name,
            entity.category,
            entity.format,
            entity.size,
            mimetype || 'application/octet-stream',
            entity.name,
            entity.title_uz,
            entity.title_ru,
            entity.title_en,
            entity.chapter,
            entity.duration,
            entity.lang,
            entity.isActive,
            entity.createdAt,
            checksum
        );

        return new UploadResponseDto({
            id: vo.id,
            name: vo.name,
            originalFilename: vo.originalFilename,
            category: vo.category,
            format: vo.format,
            size: vo.size,
            mimetype: vo.mimetype,
            publicUrl: vo.getPublicUrl(),
            titleUz: vo.titleUz,
            titleRu: vo.titleRu,
            titleEn: vo.titleEn,
            chapter: vo.chapter,
            duration: vo.duration,
            lang: vo.lang,
            isActive: vo.isActive,
            createdAt: vo.createdAt,
            checksum: vo.checksum,
            fileExtension: vo.getFileExtension(),
            isImage: vo.isImage(),
            isAudio: vo.isAudio(),
            isDocument: vo.isDocument()
        });
    }

    /**
     * Map multiple entities to DTOs
     */
    static toDtoList(entities: File[]): UploadResponseDto[] {
        return entities.map(entity => this.toDto(entity));
    }

    /**
     * Map upload request DTO to value object
     */
    static fromUploadDto(dto: UploadFileDto, filename: string, mimetype: string, size: number, encoding?: string): UploadRequestVO {
        return new UploadRequestVO(
            dto.category,
            dto.format,
            filename,
            mimetype,
            size,
            encoding,
            dto.titleUz,
            dto.titleRu,
            dto.titleEn,
            dto.chapter || 0,
            dto.duration || 0,
            dto.lang || 'uzb'
        );
    }

    /**
     * Map upload request VO to database entity
     */
    static fromUploadRequestToEntity(
        requestVO: UploadRequestVO, 
        storedPath: string, 
        actualSize?: number
    ): Partial<File> {
        return {
            name: storedPath,
            title_uz: requestVO.titleUz || requestVO.filename,
            title_ru: requestVO.titleRu || requestVO.titleUz || requestVO.filename,
            title_en: requestVO.titleEn || requestVO.titleUz || requestVO.filename,
            format: requestVO.format,
            category: requestVO.category,
            chapter: requestVO.chapter,
            duration: requestVO.duration,
            size: actualSize || requestVO.size,
            lang: requestVO.lang,
            isActive: true
        };
    }

    /**
     * Map upload result VO to response DTO
     */
    static fromUploadResultToDto(uploadResult: UploadResultVO): UploadResponseDto {
        return new UploadResponseDto(uploadResult.toPlainObject());
    }

    /**
     * Map database entity to upload result VO
     */
    static fromEntityToUploadResult(
        entity: File, 
        originalFilename?: string, 
        mimetype?: string, 
        checksum?: string
    ): UploadResultVO {
        return new UploadResultVO(
            entity.id,
            entity.name,
            originalFilename || entity.name,
            entity.category,
            entity.format,
            entity.size,
            mimetype || 'application/octet-stream',
            entity.name,
            entity.title_uz,
            entity.title_ru,
            entity.title_en,
            entity.chapter,
            entity.duration,
            entity.lang,
            entity.isActive,
            entity.createdAt,
            checksum
        );
    }

    /**
     * Update entity with DTO data
     */
    static updateEntityFromDto(entity: File, dto: UpdateUploadDto): void {
        if (dto.titleUz !== undefined) entity.title_uz = dto.titleUz;
        if (dto.titleRu !== undefined) entity.title_ru = dto.titleRu;
        if (dto.titleEn !== undefined) entity.title_en = dto.titleEn;
        if (dto.chapter !== undefined) entity.chapter = dto.chapter;
        if (dto.duration !== undefined) entity.duration = dto.duration;
        if (dto.lang !== undefined) entity.lang = dto.lang;
        if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    }

    /**
     * Format file size for display
     */
    static formatFileSize(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    /**
     * Get localized title based on current context
     */
    static getLocalizedTitle(entity: File): string {
        const currentLocale = I18nContext.current()?.lang || 'uz';
        
        switch (currentLocale) {
            case 'ru':
                return entity.title_ru || entity.title_uz || entity.name;
            case 'en':
                return entity.title_en || entity.title_uz || entity.name;
            default:
                return entity.title_uz || entity.name;
        }
    }
}