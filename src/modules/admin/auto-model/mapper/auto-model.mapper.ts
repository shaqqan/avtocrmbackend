import { AutoModels } from 'src/databases/typeorm/entities';
import { AutoModelResponseDto } from '../dto/response/auto-model.res.dto';
import { CreateAutoModelDto } from '../dto/request/create-auto-model.dto';
import { UpdateAutoModelDto } from '../dto/request/update-auto-model.dto';

export class AutoModelMapper {
  static toDto(entity: AutoModels): AutoModelResponseDto {
    return new AutoModelResponseDto(
      entity.id,
      entity.name,
      entity.brandId,
      entity.brand,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: AutoModels[]): AutoModelResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateAutoModelDto): AutoModels {
    const autoModel = new AutoModels();
    Object.assign(autoModel, dto);
    return autoModel;
  }

  static toEntityFromUpdateDto(dto: UpdateAutoModelDto, existingAutoModel: AutoModels): AutoModels {
    return Object.assign(existingAutoModel, dto);
  }
}
