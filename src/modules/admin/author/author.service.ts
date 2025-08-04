import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/request/create-author.dto';
import { UpdateAuthorDto } from './dto/request/update-author.dto';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/databases/typeorm/entities';
import { ILike, Repository } from 'typeorm';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { AuthorMapper } from './mapper/author.mapper';
import { AuthorListMapper } from './mapper/author-list.mapper';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly i18n: I18nService
  ) { }
  async create(createAuthorDto: CreateAuthorDto) {
    const author = await this.authorRepository.save(AuthorMapper.toEntityFromCreateDto(createAuthorDto));
    return new MessageWithDataResponseDto(this.i18n.t('messages.CREATED'), AuthorMapper.toDto(author));
  }

  async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
    const sortableColumns = ['id', 'name', 'lastName', 'middleName', 'description', 'createdAt', 'updatedAt'];
    const searchableColumns = ['name_' + currentLocale, 'lastName_' + currentLocale, 'middleName_' + currentLocale, 'description_' + currentLocale];

    if (!sortableColumns.includes(sortBy)) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'));
    }

    let sortColumn = sortBy;
    if (sortBy === 'name') {
      sortColumn = 'name_' + currentLocale;
    } else if (sortBy === 'lastName') {
      sortColumn = 'lastName_' + currentLocale;
    } else if (sortBy === 'middleName') {
      sortColumn = 'middleName_' + currentLocale;
    } else if (sortBy === 'description') {
      sortColumn = 'description_' + currentLocale;
    }

    const [authors, total] = await this.authorRepository.findAndCount({
      where: search ?
        searchableColumns.map(column => ({ [column]: ILike(`%${search}%`) }))
        : undefined,
      order: {
        [sortColumn]: sortOrder,
      },
      skip,
      take,
    });

    return new BasePaginationResponseDto(AuthorMapper.toDtoList(authors), { total, page, limit });
  }

  public async findOne(id: number) {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return AuthorMapper.toDto(author);
  }

  public async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    const updatedAuthor = await this.authorRepository.save({
      ...author,
      ...AuthorMapper.toEntityFromUpdateDto(updateAuthorDto, author)
    });
    return new MessageWithDataResponseDto(this.i18n.t('messages.UPDATED'), AuthorMapper.toDto(updatedAuthor));
  }

  public async remove(id: number) {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    await this.authorRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('messages.DELETED'));
  }

  public async list() {
    const currentLocale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
    const authors = await this.authorRepository.find({
      select: {
        id: true,
        [`name_${currentLocale}`]: true,
        [`lastName_${currentLocale}`]: true,
        [`middleName_${currentLocale}`]: true,
      },
    });

    return AuthorListMapper.toDtoList(authors);
  }
}
