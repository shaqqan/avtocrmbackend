import { AutoBrand } from 'src/databases/typeorm/entities';
import { AutoBrandResponseDto } from '../dto/response/auto-brand.res.dto';
import { CreateAutoBrandDto } from '../dto/request/create-auto-brand.dto';
import { UpdateAutoBrandDto } from '../dto/request/update-auto-brand.dto';

export class AutoBrandMapper {
  static toDto(entity: AutoBrand): AutoBrandResponseDto {
    return new AutoBrandResponseDto(
      entity.id,
      entity.name,
      entity.models || [],
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: AutoBrand[]): AutoBrandResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateAutoBrandDto): AutoBrand {
    const autoBrand = new AutoBrand();
    Object.assign(autoBrand, dto);
    return autoBrand;
  }

  static toEntityFromUpdateDto(dto: UpdateAutoBrandDto, existingAutoBrand: AutoBrand): AutoBrand {
    return Object.assign(existingAutoBrand, dto);
  }
}
