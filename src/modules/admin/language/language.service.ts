import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/request/create-language.dto';
import { UpdateLanguageDto } from './dto/request/update-language.dto';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response/';
import { I18nService } from 'nestjs-i18n';
import { FindOneLanguageResponseDto } from './dto/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { Language } from 'src/databases/typeorm/entities/language.entity';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private i18n: I18nService
  ) { }

  public async create(createLanguageDto: CreateLanguageDto): Promise<MessageWithDataResponseDto> {
    const { iconId, locale, name } = createLanguageDto;

    const language = await this.languageRepository.create({
      name,
      locale,
      iconId,
    }).save();

    const languageWithIcon = await this.languageRepository.findOne({
      where: { id: language.id },
      relations: { icon: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.LANGUAGE.CREATED'),
      new FindOneLanguageResponseDto(languageWithIcon)
    );
  }

  public async findAll({ take, skip, page, limit, sortBy, sortOrder, search }: BasePaginationDto): Promise<BasePaginationResponseDto> {
    const allowedSortFields: string[] = ['id', 'name', 'locale', 'createdAt', 'updatedAt'];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'));
    }

    const [languages, total] = await this.languageRepository.findAndCount({
      relations: { icon: true },
      where: search ? [
        { name: ILike(`%${search}%`) },
        { locale: ILike(`%${search}%`) },
      ] : undefined,
      order: {
        [sortBy]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
      },
      skip,
      take,
    });

    return new BasePaginationResponseDto(languages.map((language) => new FindOneLanguageResponseDto(language)), {
      total,
      page: page,
      limit: limit,
    });
  }

  public async findOne(id: number): Promise<FindOneLanguageResponseDto> {
    const language = await this.languageRepository.findOne({
      where: { id },
      relations: { icon: true },
    });

    if (!language) {
      throw new NotFoundException(this.i18n.t('errors.LANGUAGE.NOT_FOUND'));
    }

    return new FindOneLanguageResponseDto(language);
  }

  public async update(id: number, updateLanguageDto: UpdateLanguageDto): Promise<MessageWithDataResponseDto> {
    const { locale, name } = updateLanguageDto;

    // Check if language already exists
    await this.languageRepository.update(id, updateLanguageDto);

    const language = await this.languageRepository.findOne({
      where: { id },
      relations: { icon: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.LANGUAGE.UPDATED'),
      new FindOneLanguageResponseDto(language)
    );
  }

  public async remove(id: number): Promise<MessageResponseDto> {
    await this.findOne(id);
    await this.languageRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('success.LANGUAGE.REMOVED'));
  }

}
