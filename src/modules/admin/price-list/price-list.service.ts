import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { PriceList, AutoModels, AutoColor, AutoPosition } from 'src/databases/typeorm/entities';
import { CreatePriceListDto } from './dto/request/create-price-list.dto';
import { UpdatePriceListDto } from './dto/request/update-price-list.dto';
import { PriceListMapper } from './mapper/price-list.mapper';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';
import { paginate, FilterOperator, FilterSuffix } from 'nestjs-paginate';
import { convertPaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class PriceListService {
  constructor(
    @InjectRepository(PriceList)
    private readonly priceListRepository: Repository<PriceList>,
    @InjectRepository(AutoModels)
    private readonly autoModelRepository: Repository<AutoModels>,
    @InjectRepository(AutoColor)
    private readonly autoColorRepository: Repository<AutoColor>,
    @InjectRepository(AutoPosition)
    private readonly autoPositionRepository: Repository<AutoPosition>,
    private readonly i18n: I18nService,
  ) {}

  async create(createPriceListDto: CreatePriceListDto) {
    // Validate related entities exist
    const autoModel = await this.autoModelRepository.findOne({
      where: { id: createPriceListDto.autoModelId },
    });
    if (!autoModel) {
      throw new BadRequestException(
        this.i18n.t('errors.PRICE_LIST.AUTO_MODEL_NOT_FOUND'),
      );
    }

    const autoColor = await this.autoColorRepository.findOne({
      where: { id: createPriceListDto.autoColorId },
    });
    if (!autoColor) {
      throw new BadRequestException(
        this.i18n.t('errors.PRICE_LIST.AUTO_COLOR_NOT_FOUND'),
      );
    }

    const autoPosition = await this.autoPositionRepository.findOne({
      where: { id: createPriceListDto.autoPositionId },
    });
    if (!autoPosition) {
      throw new BadRequestException(
        this.i18n.t('errors.PRICE_LIST.AUTO_POSITION_NOT_FOUND'),
      );
    }

    // Check if price list already exists for this combination
    const existingPriceList = await this.priceListRepository.findOne({
      where: {
        autoModelId: createPriceListDto.autoModelId,
        autoColorId: createPriceListDto.autoColorId,
        autoPositionId: createPriceListDto.autoPositionId,
      },
    });

    if (existingPriceList) {
      throw new BadRequestException(
        this.i18n.t('errors.PRICE_LIST.ALREADY_EXISTS'),
      );
    }

    // Create price list entity
    const priceList = PriceListMapper.toEntityFromCreateDto(createPriceListDto);
    const savedPriceList = await this.priceListRepository.save(priceList);

    // Fetch the saved price list with relations
    const priceListWithRelations = await this.priceListRepository.findOne({
      where: { id: savedPriceList.id },
      relations: ['autoModel', 'autoColor', 'autoPosition'],
    });

    if (!priceListWithRelations) {
      throw new NotFoundException(this.i18n.t('errors.PRICE_LIST.NOT_FOUND'));
    }

    return new MessageWithDataResponseDto(
      this.i18n.t('success.PRICE_LIST.CREATED'),
      PriceListMapper.toDto(priceListWithRelations),
    );
  }

  async findAll(query: BasePaginationDto) {
    const result = await paginate(query, this.priceListRepository, {
      sortableColumns: [
        'id',
        'autoModelId',
        'autoColorId',
        'autoPositionId',
        'basePrice',
        'wholesalePrice',
        'retailPrice',
        'vat',
        'margin',
        'validFrom',
        'validTo',
        'isActive',
        'createdAt',
        'updatedAt'
      ],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['autoModel.name', 'autoColor.name', 'autoPosition.name'],
      select: [
        'id',
        'autoModelId',
        'autoColorId',
        'autoPositionId',
        'basePrice',
        'wholesalePrice',
        'retailPrice',
        'vat',
        'margin',
        'validFrom',
        'validTo',
        'isActive',
        'createdAt',
        'updatedAt',
        'autoModel.id',
        'autoModel.name',
        'autoColor.id',
        'autoColor.name',
        'autoPosition.id',
        'autoPosition.name'
      ],
      relations: ['autoModel', 'autoColor', 'autoPosition'],
      filterableColumns: {
        autoModelId: true,
        autoColorId: true,
        autoPositionId: true,
        basePrice: true,
        wholesalePrice: true,
        retailPrice: true,
        vat: true,
        margin: true,
        validFrom: true,
        validTo: true,
        isActive: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return convertPaginatedResult(result, PriceListMapper.toDtoList);
  }

  async findOne(id: number) {
    const priceList = await this.priceListRepository.findOne({
      where: { id },
      relations: ['autoModel', 'autoColor', 'autoPosition'],
    });

    if (!priceList) {
      throw new NotFoundException(this.i18n.t('errors.PRICE_LIST.NOT_FOUND'));
    }

    return PriceListMapper.toDto(priceList);
  }

  async update(id: number, updatePriceListDto: UpdatePriceListDto) {
    const priceList = await this.priceListRepository.findOne({
      where: { id },
    });

    if (!priceList) {
      throw new NotFoundException(this.i18n.t('errors.PRICE_LIST.NOT_FOUND'));
    }

    // Validate related entities exist if they're being changed
    if (updatePriceListDto.autoModelId) {
      const autoModel = await this.autoModelRepository.findOne({
        where: { id: updatePriceListDto.autoModelId },
      });
      if (!autoModel) {
        throw new BadRequestException(
          this.i18n.t('errors.PRICE_LIST.AUTO_MODEL_NOT_FOUND'),
        );
      }
    }

    if (updatePriceListDto.autoColorId) {
      const autoColor = await this.autoColorRepository.findOne({
        where: { id: updatePriceListDto.autoColorId },
      });
      if (!autoColor) {
        throw new BadRequestException(
          this.i18n.t('errors.PRICE_LIST.AUTO_COLOR_NOT_FOUND'),
        );
      }
    }

    if (updatePriceListDto.autoPositionId) {
      const autoPosition = await this.autoPositionRepository.findOne({
        where: { id: updatePriceListDto.autoPositionId },
      });
      if (!autoPosition) {
        throw new BadRequestException(
          this.i18n.t('errors.PRICE_LIST.AUTO_POSITION_NOT_FOUND'),
        );
      }
    }

    // Check if price list already exists for this combination if any of the IDs are being changed
    if (updatePriceListDto.autoModelId || updatePriceListDto.autoColorId || updatePriceListDto.autoPositionId) {
      const newAutoModelId = updatePriceListDto.autoModelId || priceList.autoModelId;
      const newAutoColorId = updatePriceListDto.autoColorId || priceList.autoColorId;
      const newAutoPositionId = updatePriceListDto.autoPositionId || priceList.autoPositionId;

      const existingPriceList = await this.priceListRepository.findOne({
        where: {
          autoModelId: newAutoModelId,
          autoColorId: newAutoColorId,
          autoPositionId: newAutoPositionId,
          id: Not(id), // Exclude current price list
        },
      });

      if (existingPriceList) {
        throw new BadRequestException(
          this.i18n.t('errors.PRICE_LIST.ALREADY_EXISTS'),
        );
      }
    }

    // Update price list
    const updatedPriceList = PriceListMapper.toEntityFromUpdateDto(updatePriceListDto, priceList);
    const savedPriceList = await this.priceListRepository.save(updatedPriceList);

    // Fetch the updated price list with relations
    const priceListWithRelations = await this.priceListRepository.findOne({
      where: { id: savedPriceList.id },
      relations: ['autoModel', 'autoColor', 'autoPosition'],
    });

    if (!priceListWithRelations) {
      throw new NotFoundException(this.i18n.t('errors.PRICE_LIST.NOT_FOUND'));
    }

    return new MessageWithDataResponseDto(
      this.i18n.t('success.PRICE_LIST.UPDATED'),
      PriceListMapper.toDto(priceListWithRelations),
    );
  }

  async remove(id: number) {
    const priceList = await this.priceListRepository.findOne({
      where: { id },
    });

    if (!priceList) {
      throw new NotFoundException(this.i18n.t('errors.PRICE_LIST.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.priceListRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.PRICE_LIST.DELETED'));
  }
}
