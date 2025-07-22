import { Injectable, NotFoundException } from '@nestjs/common';
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
  public async create(createLanguageDto: CreateLanguageDto): Promise<MessageResponseDto> {
    const { iconId, ...rest } = createLanguageDto;
    await this.prisma.language.create({
      data: {
        ...rest,
        icon: {
          connect: {
            id: iconId,
          },
        },
      },
    });
    return new MessageResponseDto(this.i18n.t('success.LANGUAGE.CREATED'));
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
    await this.findOne(id);
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
}
