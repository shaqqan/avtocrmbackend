import { AutoColor } from 'src/databases/typeorm/entities';
import { AutoColorResponseDto } from '../dto/response/auto-color.res.dto';
import { CreateAutoColorDto } from '../dto/request/create-auto-color.dto';
import { UpdateAutoColorDto } from '../dto/request/update-auto-color.dto';

export class AutoColorMapper {
  static toDto(entity: AutoColor): AutoColorResponseDto {
    return new AutoColorResponseDto(
      entity.id,
      entity.name,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: AutoColor[]): AutoColorResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateAutoColorDto): AutoColor {
    const autoColor = new AutoColor();
    Object.assign(autoColor, dto);
    return autoColor;
  }

  static toEntityFromUpdateDto(dto: UpdateAutoColorDto, existingAutoColor: AutoColor): AutoColor {
    return Object.assign(existingAutoColor, dto);
  }
}
