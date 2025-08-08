import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Genre } from 'src/databases/typeorm/entities';
import { currentLocale } from 'src/common/utils';
import { decodeHTML } from 'entities';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) { }

  async findAll() {
    const locale = currentLocale();
    const genres = await this.genreRepository.find({
      relations: {
        children: true,
      },
      select: {
        id: true,
        [`name_${locale}`]: true,
        children: {
          id: true,
          [`name_${locale}`]: true,
        },
      },
      where: {
        parentId: IsNull(),
      },
      order: {
        [`name_${locale}`]: 'ASC',
        children: {
          [`name_${locale}`]: 'ASC',
        },
      },
    });

    return genres.map((genre) => ({
      id: genre.id,
      name: decodeHTML(genre[`name_${locale}`]),
      children: genre.children.map((child) => ({
        id: child.id,
        name: decodeHTML(child[`name_${locale}`]),
      })),
    }));
  }

  async getTopGenres() {
    const locale = currentLocale();

    const genres = await this.genreRepository
      .createQueryBuilder('genre')
      .leftJoin('genre.books', 'book', 'book.published = :bookPublished', { bookPublished: '1' })
      .leftJoin('genre.audiobooks', 'audiobook', 'audiobook.published = :audioBookPublished', { audioBookPublished: '1' })
      .select([
        'genre.id',
        `genre.name_${locale}`,
      ])
      .addSelect('COUNT(DISTINCT book.id)', 'bookCount')
      .addSelect('COUNT(DISTINCT audiobook.id)', 'audioBookCount')
      .groupBy('genre.id')
      .orderBy('(COUNT(DISTINCT book.id) + COUNT(DISTINCT audiobook.id))', 'DESC')
      .limit(30)
      .getRawMany();

    return genres.map((genre) => ({
      name: decodeHTML(genre[`genre_name_${locale}`]),
      bookCount: parseInt(genre.bookCount) || 0,
      audioBookCount: parseInt(genre.audioBookCount) || 0,
    }));
  }
}
