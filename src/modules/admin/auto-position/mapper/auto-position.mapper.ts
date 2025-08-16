import { AutoPosition } from 'src/databases/typeorm/entities';
import { AutoPositionResponseDto } from '../dto/response/auto-position.res.dto';
import { CreateAutoPositionDto } from '../dto/request/create-auto-position.dto';
import { UpdateAutoPositionDto } from '../dto/request/update-auto-position.dto';

export class AutoPositionMapper {
  static toDto(entity: AutoPosition): AutoPositionResponseDto {
    return new AutoPositionResponseDto(
      entity.id,
      entity.autoModelId,
      entity.autoModel,
      entity.name,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: AutoPosition[]): AutoPositionResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateAutoPositionDto): AutoPosition {
    const autoPosition = new AutoPosition();
    Object.assign(autoPosition, dto);
    return autoPosition;
  }

  static toEntityFromUpdateDto(dto: UpdateAutoPositionDto, existingAutoPosition: AutoPosition): AutoPosition {
    return Object.assign(existingAutoPosition, dto);
  }
}
