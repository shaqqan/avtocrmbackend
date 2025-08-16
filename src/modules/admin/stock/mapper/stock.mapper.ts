import { Stock, StockStatus } from 'src/databases/typeorm/entities';
import { StockResponseDto } from '../dto/response/stock.res.dto';
import { CreateStockDto } from '../dto/request/create-stock.dto';
import { UpdateStockDto } from '../dto/request/update-stock.dto';

export class StockMapper {
  static toDto(entity: Stock): StockResponseDto {
    return new StockResponseDto(
      entity.id,
      entity.warehouseId,
      entity.warehouse,
      entity.autoModelId,
      entity.autoModel,
      entity.autoColorId,
      entity.autoColor,
      entity.autoPositionId,
      entity.autoPosition,
      entity.bodyNumber,
      entity.arrivalDate,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: Stock[]): StockResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreateStockDto): Stock {
    const stock = new Stock();
    Object.assign(stock, dto);
    if (dto.arrivalDate) {
      stock.arrivalDate = new Date(dto.arrivalDate);
    }
    if (!dto.status) {
      stock.status = StockStatus.AVAILABLE;
    }
    return stock;
  }

  static toEntityFromUpdateDto(dto: UpdateStockDto, existingStock: Stock): Stock {
    if (dto.warehouseId !== undefined) existingStock.warehouseId = dto.warehouseId;
    if (dto.autoModelId !== undefined) existingStock.autoModelId = dto.autoModelId;
    if (dto.autoColorId !== undefined) existingStock.autoColorId = dto.autoColorId;
    if (dto.autoPositionId !== undefined) existingStock.autoPositionId = dto.autoPositionId;
    if (dto.bodyNumber !== undefined) existingStock.bodyNumber = dto.bodyNumber;
    if (dto.arrivalDate !== undefined) existingStock.arrivalDate = new Date(dto.arrivalDate);
    if (dto.status !== undefined) existingStock.status = dto.status;
    return existingStock;
  }
}
