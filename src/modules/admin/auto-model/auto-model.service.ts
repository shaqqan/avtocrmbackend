import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AutoModels as AutoModel, AutoBrand } from 'src/databases/typeorm/entities';
import { CreateAutoModelDto } from './dto/request/create-auto-model.dto';
import { UpdateAutoModelDto } from './dto/request/update-auto-model.dto';
import { AutoModelMapper } from './mapper/auto-model.mapper';
import { BasePaginationDto, PaginateQuery, Paginated } from 'src/common/dto/request/base-pagination.dto';
import { paginate } from 'nestjs-paginate';
import { autoModelPaginateConfig } from 'src/common/utils/pagination.utils';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';

@Injectable()
export class AutoModelService {
  constructor(
    @InjectRepository(AutoModel)
    private readonly autoModelRepository: Repository<AutoModel>,
    @InjectRepository(AutoBrand)
    private readonly autoBrandRepository: Repository<AutoBrand>,
    private readonly i18n: I18nService,
  ) {}

  async create(createAutoModelDto: CreateAutoModelDto) {
    // Check if brand exists
    const brand = await this.autoBrandRepository.findOne({
      where: { id: createAutoModelDto.brandId },
    });

    if (!brand) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_BRAND.NOT_FOUND'),
      );
    }

    // Check if model name already exists for this brand
    const existingModel = await this.autoModelRepository.findOne({
      where: { 
        name: createAutoModelDto.name,
        brandId: createAutoModelDto.brandId,
      },
    });

    if (existingModel) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_MODEL.NAME_ALREADY_EXISTS_FOR_BRAND'),
      );
    }

    // Create auto model entity
    const autoModel = this.autoModelRepository.create({
      name: createAutoModelDto.name,
      brandId: createAutoModelDto.brandId,
    });

    const savedModel = await this.autoModelRepository.save(autoModel);

    // Fetch model with relations for response
    const modelWithBrand = await this.autoModelRepository.findOne({
      where: { id: savedModel.id },
      relations: { brand: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUTO_MODEL.CREATED'),
      AutoModelMapper.toDto(modelWithBrand!),
    );
  }

  public async findAll(query: PaginateQuery): Promise<Paginated<AutoModel>> {
    return paginate(query, this.autoModelRepository, {
      ...autoModelPaginateConfig,
      relations: ['brand'],
    });
  }

  public async findOne(id: number) {
    const model = await this.autoModelRepository.findOne({
      where: { id },
      relations: {
        brand: true,
      },
    });

    if (!model) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_MODEL.NOT_FOUND'));
    }

    return AutoModelMapper.toDto(model);
  }

  async update(id: number, updateAutoModelDto: UpdateAutoModelDto) {
    const model = await this.autoModelRepository.findOne({
      where: { id },
      relations: { brand: true },
    });

    if (!model) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_MODEL.NOT_FOUND'));
    }

    // Check if brand exists if brandId is being changed
    if (updateAutoModelDto.brandId && updateAutoModelDto.brandId !== model.brandId) {
      const brand = await this.autoBrandRepository.findOne({
        where: { id: updateAutoModelDto.brandId },
      });

      if (!brand) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_BRAND.NOT_FOUND'),
        );
      }
    }

    // Check if model name already exists for the brand (if name or brandId is being changed)
    if ((updateAutoModelDto.name && updateAutoModelDto.name !== model.name) ||
        (updateAutoModelDto.brandId && updateAutoModelDto.brandId !== model.brandId)) {
      const existingModel = await this.autoModelRepository.findOne({
        where: { 
          name: updateAutoModelDto.name || model.name,
          brandId: updateAutoModelDto.brandId || model.brandId,
        },
      });

      if (existingModel && existingModel.id !== id) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_MODEL.NAME_ALREADY_EXISTS_FOR_BRAND'),
        );
      }
    }

    // Update model
    const updatedModel = await this.autoModelRepository.save({
      ...model,
      ...AutoModelMapper.toEntityFromUpdateDto(updateAutoModelDto, model),
    });

    // Fetch updated model with relations
    const modelWithBrand = await this.autoModelRepository.findOne({
      where: { id: updatedModel.id },
      relations: { brand: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUTO_MODEL.UPDATED'),
      AutoModelMapper.toDto(modelWithBrand!),
    );
  }

  async remove(id: number) {
    const model = await this.autoModelRepository.findOne({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_MODEL.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.autoModelRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.AUTO_MODEL.DELETED'));
  }

  // Additional method to get models by brand
  async findModelsByBrand(brandId: number) {
    const models = await this.autoModelRepository.find({
      where: { brandId },
      relations: { brand: true },
      order: { name: 'ASC' },
    });

    return AutoModelMapper.toDtoList(models);
  }

  // Additional method to get models with brand information
  async findModelsWithBrandInfo() {
    const models = await this.autoModelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.brand', 'brand')
      .select([
        'model.id',
        'model.name',
        'model.brandId',
        'model.createdAt',
        'model.updatedAt',
        'brand.id',
        'brand.name',
      ])
      .orderBy('brand.name', 'ASC')
      .addOrderBy('model.name', 'ASC')
      .getMany();

    return AutoModelMapper.toDtoList(models);
  }

  // Additional method to search models by brand name
  async searchModelsByBrandName(brandName: string) {
    const models = await this.autoModelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.brand', 'brand')
      .where('brand.name ILIKE :brandName', { brandName: `%${brandName}%` })
      .orderBy('brand.name', 'ASC')
      .addOrderBy('model.name', 'ASC')
      .getMany();

    return AutoModelMapper.toDtoList(models);
  }
}
