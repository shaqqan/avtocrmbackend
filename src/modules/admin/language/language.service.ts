import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/request/create-language.dto';
import { UpdateLanguageDto } from './dto/request/update-language.dto';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response/';
import { I18nService } from 'nestjs-i18n';
import { FindOneLanguageResponseDto } from './dto/response';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService, private i18n: I18nService) { }
  public async create(createLanguageDto: CreateLanguageDto): Promise<MessageWithDataResponseDto> {
    const { iconId, locale, name } = createLanguageDto;

    // Check if language already exists
    await this.checkLanguageExists(locale, name);

    const language = await this.prisma.language.create({
      data: {
        name,
        locale,
        icon: {
          connect: {
            id: iconId,
          },
        },
      },
    });
    return new MessageWithDataResponseDto(this.i18n.t('success.LANGUAGE.CREATED'), new FindOneLanguageResponseDto(language));
  }

  public async findAll(query: BasePaginationDto): Promise<BasePaginationResponseDto> {
    const result = await this.prisma.findManyWithPagination({
      model: 'language',
      query: query,
      searchFields: ['name', 'locale'],
      allowedSortFields: ['id', 'name', 'locale', 'createdAt', 'updatedAt'],
      includeFields: {
        icon: {
          select: {
            path: true,
          },
        }
      },
    });

    return {
      data: result.data.map((language) => new FindOneLanguageResponseDto(language)),
      meta: result.meta,
    }
  }

  public async findOne(id: number): Promise<FindOneLanguageResponseDto> {
    const language = await this.prisma.language.findUnique({
      where: { id },
      include: {
        icon: {
          select: {
            path: true,
          },
        }
      },
    });

    if (!language) {
      throw new NotFoundException(this.i18n.t('errors.LANGUAGE.NOT_FOUND'));
    }

    return new FindOneLanguageResponseDto(language);
  }

  public async update(id: number, updateLanguageDto: UpdateLanguageDto): Promise<MessageWithDataResponseDto> {
    const { locale, name, ...rest } = updateLanguageDto;

    // Check if language already exists
    await this.checkLanguageExists(locale, name, id);

    const language = await this.prisma.language.update({
      where: { id },
      include: {
        icon: {
          select: {
            path: true,
          },
        }
      },
      data: updateLanguageDto,
    });
    return new MessageWithDataResponseDto(this.i18n.t('success.LANGUAGE.UPDATED'), new FindOneLanguageResponseDto(language));
  }

  public async remove(id: number): Promise<MessageResponseDto> {
    await this.findOne(id);
    await this.prisma.language.delete({
      where: { id },

    });
    return new MessageResponseDto(this.i18n.t('success.LANGUAGE.REMOVED'));
  }

  private async checkLanguageExists(locale?: string, name?: string, id?: number): Promise<void> {
    const existingLanguage = await this.prisma.language.findFirst({
      where: {
        OR: [
          { locale },
          { name }
        ],
        id: id ? { not: id } : undefined
      }
    });

    if (existingLanguage) {
      if (existingLanguage.locale === locale) {
        throw new ConflictException(this.i18n.t('error.LANGUAGE.LOCALE_EXISTS'));
      }
      if (existingLanguage.name === name) {
        throw new ConflictException(this.i18n.t('error.LANGUAGE.NAME_EXISTS'));
      }
    } else {
      throw new NotFoundException(this.i18n.t('errors.LANGUAGE.NOT_FOUND'));
    }
  }
}
