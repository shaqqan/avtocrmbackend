import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { AutoBrand } from 'src/databases/typeorm/entities';
import { CreateAutoBrandDto } from './dto/request/create-auto-brand.dto';
import { UpdateAutoBrandDto } from './dto/request/update-auto-brand.dto';
import { AutoBrandMapper } from './mapper/auto-brand.mapper';
import { BasePaginationDto, PaginateQuery, Paginated } from 'src/common/dto/request/base-pagination.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';
import { paginate } from 'nestjs-paginate';
import { autoBrandPaginateConfig } from 'src/common/utils/pagination.utils';

@Injectable()
export class AutoBrandService {
  constructor(
    @InjectRepository(AutoBrand)
    private readonly autoBrandRepository: Repository<AutoBrand>,
    private readonly i18n: I18nService,
  ) {}

  async create(createAutoBrandDto: CreateAutoBrandDto) {
    // Check if brand name already exists
    const existingBrand = await this.autoBrandRepository.findOne({
      where: { name: createAutoBrandDto.name },
    });

    if (existingBrand) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_BRAND.NAME_ALREADY_EXISTS'),
      );
    }

    // Create auto brand entity
    const autoBrand = this.autoBrandRepository.create({
      name: createAutoBrandDto.name,
    });

    const savedBrand = await this.autoBrandRepository.save(autoBrand);

    // Fetch brand with relations for response
    const brandWithModels = await this.autoBrandRepository.findOne({
      where: { id: savedBrand.id },
      relations: { models: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUTO_BRAND.CREATED'),
      AutoBrandMapper.toDto(brandWithModels!),
    );
  }

  public async findAll(query: PaginateQuery): Promise<Paginated<AutoBrand>> {
    return paginate(query, this.autoBrandRepository, {
      ...autoBrandPaginateConfig,
      relations: ['models'],
    });
  }

  public async findOne(id: number) {
    const brand = await this.autoBrandRepository.findOne({
      where: { id },
      relations: {
        models: true,
      },
    });

    if (!brand) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_BRAND.NOT_FOUND'));
    }

    return AutoBrandMapper.toDto(brand);
  }

  async update(id: number, updateAutoBrandDto: UpdateAutoBrandDto) {
    const brand = await this.autoBrandRepository.findOne({
      where: { id },
      relations: { models: true },
    });

    if (!brand) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_BRAND.NOT_FOUND'));
    }

    // Check if name is being changed and if it already exists
    if (updateAutoBrandDto.name && updateAutoBrandDto.name !== brand.name) {
      const existingBrand = await this.autoBrandRepository.findOne({
        where: { name: updateAutoBrandDto.name },
      });

      if (existingBrand) {
        throw new BadRequestException(
          this.i18n.t('errors.AUTO_BRAND.NAME_ALREADY_EXISTS'),
        );
      }
    }

    // Update brand
    const updatedBrand = await this.autoBrandRepository.save({
      ...brand,
      ...AutoBrandMapper.toEntityFromUpdateDto(updateAutoBrandDto, brand),
    });

    // Fetch updated brand with relations
    const brandWithModels = await this.autoBrandRepository.findOne({
      where: { id: updatedBrand.id },
      relations: { models: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.AUTO_BRAND.UPDATED'),
      AutoBrandMapper.toDto(brandWithModels!),
    );
  }

  async remove(id: number) {
    const brand = await this.autoBrandRepository.findOne({
      where: { id },
      relations: { models: true },
    });

    if (!brand) {
      throw new NotFoundException(this.i18n.t('errors.AUTO_BRAND.NOT_FOUND'));
    }

    // Check if brand has models
    if (brand.models && brand.models.length > 0) {
      throw new BadRequestException(
        this.i18n.t('errors.AUTO_BRAND.CANNOT_DELETE_WITH_MODELS'),
      );
    }

    // Soft delete using TypeORM's soft delete feature
    await this.autoBrandRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.AUTO_BRAND.DELETED'));
  }

  // Additional method to get brands with model count
  async findBrandsWithModelCount() {
    const brands = await this.autoBrandRepository
      .createQueryBuilder('brand')
      .leftJoin('brand.models', 'model')
      .select([
        'brand.id',
        'brand.name',
        'brand.createdAt',
        'brand.updatedAt',
        'COUNT(model.id) as modelCount',
      ])
      .groupBy('brand.id')
      .orderBy('brand.name', 'ASC')
      .getRawMany();

    return brands.map((brand) => ({
      id: brand.brand_id,
      name: brand.brand_name,
      createdAt: brand.brand_createdAt,
      updatedAt: brand.brand_updatedAt,
      modelCount: parseInt(brand.modelcount),
    }));
  }
}
