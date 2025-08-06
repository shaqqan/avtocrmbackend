import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreateIssuerDto } from './dto/request/create-issuer.dto';
import { UpdateIssuerDto } from './dto/request/update-issuer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Issuer } from 'src/databases/typeorm/entities';
import { ILike, Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import {
  BasePaginationResponseDto,
  MessageWithDataResponseDto,
  MessageResponseDto,
} from 'src/common/dto/response';
import { IssuerMapper } from './mapper/issuer.mapper';
import { IssuerListMapper } from './mapper/issuer-list.mapper';
import { currentLocale } from 'src/common/utils';

@Injectable({ scope: Scope.REQUEST })
export class IssuerService {
  constructor(
    @InjectRepository(Issuer)
    private readonly issuerRepository: Repository<Issuer>,
    private readonly i18n: I18nService,
  ) {}

  async create(createIssuerDto: CreateIssuerDto) {
    const issuer = await this.issuerRepository.save(
      IssuerMapper.toEntityFromCreateDto(createIssuerDto),
    );
    return new MessageWithDataResponseDto(
      this.i18n.t('success.ISSUER.CREATED'),
      IssuerMapper.toDto(issuer),
    );
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;
    const locale = currentLocale();
    const allowedSortFields: string[] = [
      'id',
      'name',
      'createdAt',
      'updatedAt',
    ];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(
        this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'),
      );
    }

    const localizableFields = ['name'];
    const actualSortField = localizableFields.includes(sortBy)
      ? `${sortBy}_${locale}`
      : sortBy;

    const [issuers, total] = await this.issuerRepository.findAndCount({
      where: search
        ? {
            [`name_${locale}`]: ILike(`%${search}%`),
          }
        : undefined,
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
      throw new NotFoundException(this.i18n.t('errors.ISSUER.NOT_FOUND'));
    }
    return IssuerMapper.toDto(issuer);
  }

  async update(id: number, updateIssuerDto: UpdateIssuerDto) {
    const issuer = await this.issuerRepository.findOne({ where: { id } });
    if (!issuer) {
      throw new NotFoundException(this.i18n.t('errors.ISSUER.NOT_FOUND'));
    }

    const updatedIssuer = await this.issuerRepository.save({
      ...issuer,
      ...IssuerMapper.toEntityFromUpdateDto(updateIssuerDto, issuer),
    });
    return new MessageWithDataResponseDto(
      this.i18n.t('success.ISSUER.UPDATED'),
      IssuerMapper.toDto(updatedIssuer),
    );
  }

  async remove(id: number) {
    const issuer = await this.issuerRepository.findOne({ where: { id } });
    if (!issuer) {
      throw new NotFoundException(this.i18n.t('errors.ISSUER.NOT_FOUND'));
    }

    await this.issuerRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.ISSUER.DELETED'));
  }

  public async list() {
    const locale = currentLocale();
    const issuers = await this.issuerRepository.find({
      select: {
        id: true,
        [`name_${locale}`]: true,
      },
    });
    return IssuerListMapper.toDtoList(issuers);
  }
}
