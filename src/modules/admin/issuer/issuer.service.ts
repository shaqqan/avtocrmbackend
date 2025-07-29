import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIssuerDto } from './dto/request/create-issuer.dto';
import { UpdateIssuerDto } from './dto/request/update-issuer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Issuer } from 'src/databases/typeorm/entities';
import { ILike, Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { BasePaginationResponseDto } from 'src/common/dto/response/base-pagination.res.dto';
import { IssuerMapper } from './mapper/issuer.mapper';
import { IssuerListMapper } from './mapper/issuer-list.mapper';

@Injectable()
export class IssuerService {
  constructor(
    @InjectRepository(Issuer)
    private readonly issuerRepository: Repository<Issuer>,
    private readonly i18n: I18nService,
  ) { }

  create(createIssuerDto: CreateIssuerDto) {
    return 'This action adds a new issuer';
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
    const allowedSortFields: string[] = [
      'id',
      'name',
      'createdAt',
      'updatedAt',
    ];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'));
    }

    const localizableFields = ['name'];
    const actualSortField = localizableFields.includes(sortBy)
      ? `${sortBy}_${currentLocale}`
      : sortBy;

    const [issuers, total] = await this.issuerRepository.findAndCount({
      where: search ? {
        [`name_${currentLocale}`]: ILike(`%${search}%`),
      } : undefined,
      order: {
        [actualSortField]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
      },
      skip,
      take,
    });

    return new BasePaginationResponseDto(IssuerMapper.toDtoList(issuers), {
      total,
      page,
      limit,
    });
  }

  public async findOne(id: number) {
    const issuer = await this.issuerRepository.findOne({
      where: { id },
    });
    if (!issuer) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return IssuerMapper.toDto(issuer);
  }

  update(id: number, updateIssuerDto: UpdateIssuerDto) {
    return `This action updates a #${id} issuer`;
  }

  remove(id: number) {
    return `This action removes a #${id} issuer`;
  }

  public async list() {
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
    const issuers = await this.issuerRepository.find({
      select: {
        id: true,
        [`name_${currentLocale}`]: true,
      },
    });
    return IssuerListMapper.toDtoList(issuers);
  }
}
