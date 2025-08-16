import { PriceList } from 'src/databases/typeorm/entities';
import { PriceListResponseDto } from '../dto/response/price-list.res.dto';
import { CreatePriceListDto } from '../dto/request/create-price-list.dto';
import { UpdatePriceListDto } from '../dto/request/update-price-list.dto';

export class PriceListMapper {
  static toDto(entity: PriceList): PriceListResponseDto {
    return new PriceListResponseDto(
      entity.id,
      entity.autoModelId,
      entity.autoModel,
      entity.autoColorId,
      entity.autoColor,
      entity.autoPositionId,
      entity.autoPosition,
      entity.basePrice,
      entity.wholesalePrice,
      entity.retailPrice,
      entity.vat,
      entity.margin,
      entity.validFrom,
      entity.validTo,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toDtoList(entities: PriceList[]): PriceListResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toEntityFromCreateDto(dto: CreatePriceListDto): PriceList {
    const priceList = new PriceList();
    priceList.autoModelId = dto.autoModelId;
    priceList.autoColorId = dto.autoColorId;
    priceList.autoPositionId = dto.autoPositionId;
    priceList.basePrice = dto.basePrice || null;
    priceList.wholesalePrice = dto.wholesalePrice || null;
    priceList.retailPrice = dto.retailPrice || null;
    priceList.vat = dto.vat || null;
    priceList.margin = dto.margin || null;
    priceList.validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
    priceList.validTo = dto.validTo ? new Date(dto.validTo) : null;
    priceList.isActive = dto.isActive || false;
    return priceList;
  }

  static toEntityFromUpdateDto(dto: UpdatePriceListDto, existingPriceList: PriceList): PriceList {
    if (dto.autoModelId !== undefined) existingPriceList.autoModelId = dto.autoModelId;
    if (dto.autoColorId !== undefined) existingPriceList.autoColorId = dto.autoColorId;
    if (dto.autoPositionId !== undefined) existingPriceList.autoPositionId = dto.autoPositionId;
    if (dto.basePrice !== undefined) existingPriceList.basePrice = dto.basePrice;
    if (dto.wholesalePrice !== undefined) existingPriceList.wholesalePrice = dto.wholesalePrice;
    if (dto.retailPrice !== undefined) existingPriceList.retailPrice = dto.retailPrice;
    if (dto.vat !== undefined) existingPriceList.vat = dto.vat;
    if (dto.margin !== undefined) existingPriceList.margin = dto.margin;
    if (dto.validFrom !== undefined) existingPriceList.validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
    if (dto.validTo !== undefined) existingPriceList.validTo = dto.validTo ? new Date(dto.validTo) : null;
    if (dto.isActive !== undefined) existingPriceList.isActive = dto.isActive;
    return existingPriceList;
  }
}
