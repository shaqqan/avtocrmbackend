import { Upload } from "src/databases/typeorm/entities";
import { UploadResponseDto } from "../dto/response/upload.res.dto";
import { UploadFileDto } from "../dto/request/upload-file.dto";
import { UpdateUploadDto } from "../dto/request/update-upload.dto";

export class UploadMapper {
    static toDto(entity: Upload): UploadResponseDto {
        return new UploadResponseDto(entity.id, entity.path, entity.name, entity.type, entity.size, entity.createdAt, entity.updatedAt);
    }

    static toDtoList(entities: Upload[]): UploadResponseDto[] {
        return entities.map(entity => this.toDto(entity));
    }

    static toEntityFromCreateDto(dto: UploadFileDto): Upload {
        const upload = new Upload();
        Object.assign(upload, dto);
        return upload;
    }

    static toEntityFromUpdateDto(dto: UpdateUploadDto, existingUpload: Upload): Upload {
        return Object.assign(existingUpload, dto);
    }
}