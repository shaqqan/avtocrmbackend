import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Scope,
} from '@nestjs/common';
import { CreateLanguageDto } from './dto/request/create-language.dto';
import { UpdateLanguageDto } from './dto/request/update-language.dto';
import { BasePaginationDto, SortOrder, PaginateQuery, Paginated } from 'src/common/dto/request';
import { paginate } from 'nestjs-paginate';
import { languagePaginateConfig } from 'src/common/utils/pagination.utils';
import {
  BasePaginationResponseDto,
  MessageResponseDto,
  MessageWithDataResponseDto,
} from 'src/common/dto/response/';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Language } from 'src/databases/typeorm/entities/language.entity';
import { LanguageMapper } from './mapper/language.mapper';
import { LanguageResponseDto } from './dto/response/language.res.dto';

@Injectable({ scope: Scope.REQUEST })
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private i18n: I18nService,
  ) {}

  public async create(
    createLanguageDto: CreateLanguageDto,
  ): Promise<MessageWithDataResponseDto<LanguageResponseDto>> {
    const language = LanguageMapper.toEntityFromCreateDto(createLanguageDto);
    const savedLanguage = await this.languageRepository.save(language);
    return new MessageWithDataResponseDto(
      this.i18n.t('success.LANGUAGE.CREATED'),
      LanguageMapper.toDto(savedLanguage),
    );
  }

  public async findAll(query: PaginateQuery): Promise<Paginated<Language>> {
    return paginate(query, this.languageRepository, {
      ...languagePaginateConfig,
      relations: ['icon'],
    });
  }

  public async findOne(id: number): Promise<LanguageResponseDto> {
    const language = await this.languageRepository.findOne({
      where: { id },
      relations: { icon: true },
    });

    if (!language) {
      throw new NotFoundException(this.i18n.t('errors.LANGUAGE.NOT_FOUND'));
    }

    return LanguageMapper.toDto(language);
  }

  public async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<MessageWithDataResponseDto<LanguageResponseDto>> {
    const language = await this.languageRepository.findOne({
      where: { id },
    });

    if (!language) {
      throw new NotFoundException(this.i18n.t('errors.LANGUAGE.NOT_FOUND'));
    }

    const updatedLanguage = LanguageMapper.toEntityFromUpdateDto(
      updateLanguageDto,
      language,
    );
    await this.languageRepository.save(updatedLanguage);

    return new MessageWithDataResponseDto(
      this.i18n.t('success.LANGUAGE.UPDATED'),
      LanguageMapper.toDto(updatedLanguage),
    );
  }

  public async remove(id: number): Promise<MessageResponseDto> {
    const language = await this.languageRepository.findOne({
      where: { id },
    });

    if (!language) {
      throw new NotFoundException(this.i18n.t('errors.LANGUAGE.NOT_FOUND'));
    }
    await this.languageRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.LANGUAGE.REMOVED'));
  }

  public async list(): Promise<LanguageResponseDto[]> {
    const languages = await this.languageRepository.find({
      relations: { icon: true },
    });
    return LanguageMapper.toDtoList(languages);
  }
}
