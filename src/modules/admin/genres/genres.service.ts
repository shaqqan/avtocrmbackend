import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/request/create-genre.dto';
import { UpdateGenreDto } from './dto/request/update-genre.dto';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import { Genre } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationResponseDto } from 'src/common/dto/response/base-pagination.res.dto';
import { GenreMapper } from './mapper/gender.mapper';
import { GenreListMapper } from './mapper/gender-list.mapper';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly i18n: I18nService,
  ) { }

  create(createGenreDto: CreateGenreDto) {
    return 'This action adds a new genre';
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
    const allowedSortFields: string[] = [
      'id',
      'name',
      'description',
      'createdAt',
      'updatedAt'
    ];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'));
    }

    const localizableFields = ['name', 'description'];
    const actualSortField = localizableFields.includes(sortBy)
      ? `${sortBy}_${currentLocale}`
      : sortBy;

    const [genres, total] = await this.genreRepository.findAndCount({
      relations: {
        children: true,
      },
      select: {
        id: true,
        parentId: true,
        cover: true,
        [`name_${currentLocale}`]: true,
        [`description_${currentLocale}`]: true,
        createdAt: true,
        updatedAt: true,
        children: {
          id: true,
          parentId: true,
          cover: true,
          [`name_${currentLocale}`]: true,
          [`description_${currentLocale}`]: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      where: search ? [
        { [`name_${currentLocale}`]: ILike(`%${search}%`) },
        { [`description_${currentLocale}`]: ILike(`%${search}%`) },
      ] : {
        parentId: IsNull(),
      },
      order: {
        [actualSortField]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
      },
      skip,
      take,
    });

    return new BasePaginationResponseDto(GenreMapper.toDtoList(genres), {
      total,
      page,
      limit,
    });
  }

  public async findOne(id: number) {
    const genre = await this.genreRepository.findOne({
      where: { id },
    });
    if (!genre) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return GenreMapper.toDto(genre);
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return `This action updates a #${id} genre`;
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }

  public async list() {
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
    const genres = await this.genreRepository.find({
      select: {
        id: true,
        parentId: true,
        [`name_${currentLocale}`]: true,
      },
    });
    return GenreListMapper.toDtoList(genres);
  }
}
