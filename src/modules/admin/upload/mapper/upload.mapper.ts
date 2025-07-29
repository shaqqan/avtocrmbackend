import { File } from "src/databases/typeorm/entities";
import { UploadResponseDto } from "../dto/response/upload.res.dto";
import { UploadFileDto } from "../dto/request/upload-file.dto";
import { UpdateUploadDto } from "../dto/request/update-upload.dto";
import { I18nContext } from "nestjs-i18n";

export class UploadMapper {
    static toDto(entity: File): UploadResponseDto {
        return new UploadResponseDto(
            entity.id,
            entity.name,
            entity.title_uz,
            entity.title_ru,
            entity.title_en,
            entity.format,
            entity.category,
            entity.chapter,
            entity.duration,
            entity.size,
            entity.isActive,
            entity.createdAt,
        );
    }

    static toDtoList(entities: File[]): UploadResponseDto[] {
        let currentLocale = I18nContext.current()?.lang || 'uz';
        return entities.map(entity => this.toDto(entity));
    }

    static toEntityFromCreateDto(dto: UploadFileDto): File {
        const upload = new File();
        Object.assign(upload, dto);
        return upload;
    }

    static toEntityFromUpdateDto(dto: UpdateUploadDto, existingUpload: File): File {
        return Object.assign(existingUpload, dto);
    }
}