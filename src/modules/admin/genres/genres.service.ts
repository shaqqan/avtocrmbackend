import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/request/create-genre.dto';
import { UpdateGenreDto } from './dto/request/update-genre.dto';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import { Genre } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { GenreMapper } from './mapper/gender.mapper';
import { GenreListMapper } from './mapper/gender-list.mapper';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly i18n: I18nService,
  ) { }

  async create(createGenreDto: CreateGenreDto) {
    // Validate parent genre exists if parentId is provided
    if (createGenreDto.parentId) {
      const parentGenre = await this.genreRepository.findOne({
        where: { id: createGenreDto.parentId }
      });
      if (!parentGenre) {
        throw new BadRequestException(this.i18n.t('errors.PARENT_GENRE_NOT_FOUND'));
      }
    }

    const genre = await this.genreRepository.save(GenreMapper.toEntityFromCreateDto(createGenreDto));
    return new MessageWithDataResponseDto(this.i18n.t('messages.CREATED'), GenreMapper.toDto(genre));
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

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }

    // Validate parent genre exists if parentId is provided and different from current
    if (updateGenreDto.parentId && updateGenreDto.parentId !== genre.parentId) {
      // Prevent self-reference
      if (updateGenreDto.parentId === id) {
        throw new BadRequestException(this.i18n.t('errors.CANNOT_SET_SELF_AS_PARENT'));
      }

      const parentGenre = await this.genreRepository.findOne({
        where: { id: updateGenreDto.parentId }
      });
      if (!parentGenre) {
        throw new BadRequestException(this.i18n.t('errors.PARENT_GENRE_NOT_FOUND'));
      }

      // Prevent circular references by checking if the parent is a child of current genre
      const isCircular = await this.checkCircularReference(id, updateGenreDto.parentId);
      if (isCircular) {
        throw new BadRequestException(this.i18n.t('errors.CIRCULAR_REFERENCE_DETECTED'));
      }
    }

    const updatedGenre = await this.genreRepository.save({
      ...genre,
      ...GenreMapper.toEntityFromUpdateDto(updateGenreDto, genre)
    });
    return new MessageWithDataResponseDto(this.i18n.t('messages.UPDATED'), GenreMapper.toDto(updatedGenre));
  }

  private async checkCircularReference(genreId: number, potentialParentId: number): Promise<boolean> {
    // Find all children of the current genre recursively
    const findAllChildren = async (id: number): Promise<number[]> => {
      const children = await this.genreRepository.find({
        where: { parentId: id },
        select: ['id']
      });
      
      let allChildrenIds = children.map(child => child.id);
      
      for (const child of children) {
        const grandChildren = await findAllChildren(child.id);
        allChildrenIds = allChildrenIds.concat(grandChildren);
      }
      
      return allChildrenIds;
    };

    const allChildrenIds = await findAllChildren(genreId);
    return allChildrenIds.includes(potentialParentId);
  }

  async remove(id: number) {
    const genre = await this.genreRepository.findOne({ where: { id }, relations: { children: true } });
    if (!genre) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    await this.genreRepository.remove(genre);
    return new MessageResponseDto(this.i18n.t('messages.DELETED'));
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
