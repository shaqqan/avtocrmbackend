import { Warehouse } from 'src/databases/typeorm/entities';
import { WarehouseResponseDto } from '../dto/response/warehouse.res.dto';
import { CreateWarehouseDto } from '../dto/request/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/request/update-warehouse.dto';

export class WarehouseMapper {
  static toDto(entity: Warehouse): WarehouseResponseDto {
    return new WarehouseResponseDto(
      entity.id,
      entity.name,
      entity.address,
      entity.location,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: Warehouse[]): WarehouseResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateWarehouseDto): Warehouse {
    const warehouse = new Warehouse();
    Object.assign(warehouse, dto);
    return warehouse;
  }

  static toEntityFromUpdateDto(dto: UpdateWarehouseDto, existingWarehouse: Warehouse): Warehouse {
    return Object.assign(existingWarehouse, dto);
  }
}
