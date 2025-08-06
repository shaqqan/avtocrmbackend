import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AudioBook,
  Author,
  Book,
  Genre,
  Issuer,
  News,
  ReviewBook,
  ReviewsAudiobook,
} from 'src/databases/typeorm/entities';
import { I18nContext } from 'nestjs-i18n';
import { currentLocale } from 'src/common/utils';

@Injectable({ scope: Scope.REQUEST })
export class DashboardService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(AudioBook)
    private audioBookRepository: Repository<AudioBook>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    @InjectRepository(Issuer)
    private issuerRepository: Repository<Issuer>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(ReviewBook)
    private reviewBookRepository: Repository<ReviewBook>,
    @InjectRepository(ReviewsAudiobook)
    private reviewsAudiobookRepository: Repository<ReviewsAudiobook>,
  ) {}

  async getInfoPanel() {
    const [
      bookCount,
      audioBookCount,
      authorCount,
      genreCount,
      issuerCount,
      newsCount,
    ] = await Promise.all([
      this.bookRepository.count(),
      this.audioBookRepository.count(),
      this.authorRepository.count(),
      this.genreRepository.count(),
      this.issuerRepository.count(),
      this.newsRepository.count(),
    ]);

    return {
      totalBook: bookCount + audioBookCount,
      bookCount: bookCount,
      audioBookCount: audioBookCount,
      authorCount: authorCount,
      genreCount: genreCount,
      issuerCount: issuerCount,
      newsCount: newsCount,
    };
  }

  async getBooksComparisonPieChart() {
    const [bookCount, audioBookCount] = await Promise.all([
      this.bookRepository.count(),
      this.audioBookRepository.count(),
    ]);

    return {
      bookCount,
      audioBookCount,
      total: bookCount + audioBookCount,
      percentage: {
        books:
          bookCount > 0
            ? Number(
                ((bookCount / (bookCount + audioBookCount)) * 100).toFixed(2),
              )
            : 0,
        audioBooks:
          audioBookCount > 0
            ? Number(
                ((audioBookCount / (bookCount + audioBookCount)) * 100).toFixed(
                  2,
                ),
              )
            : 0,
      },
    };
  }

  async getGenreComparisonLineGraph() {
    const locale = currentLocale();
    const genres = await this.genreRepository.find();

    const genreStats = await Promise.all(
      genres.map(async (genre) => {
        const [bookCount, audioBookCount] = await Promise.all([
          this.bookRepository
            .createQueryBuilder('book')
            .innerJoin('book.genres', 'genre')
            .where('genre.id = :genreId', { genreId: genre.id })
            .getCount(),
          this.audioBookRepository
            .createQueryBuilder('audiobook')
            .innerJoin('audiobook.genres', 'genre')
            .where('genre.id = :genreId', { genreId: genre.id })
            .getCount(),
        ]);

        return {
          genreId: genre.id,
          genreName: genre[`name_${locale}`],
          books: bookCount,
          audioBooks: audioBookCount,
          total: bookCount + audioBookCount,
        };
      }),
    );

    return genreStats.filter((stat) => stat.total > 0);
  }

  async getAudioBooksRatingStats() {
    const ratingStats = await this.reviewsAudiobookRepository
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .groupBy('review.rating')
      .getRawMany();

    const totalReviews = ratingStats.reduce(
      (sum, stat) => sum + parseInt(stat.count),
      0,
    );

    return {
      ratingStats: ratingStats.map((stat) => ({
        rating: parseInt(stat.rating),
        count: parseInt(stat.count),
        percentage:
          totalReviews > 0
            ? Number(((parseInt(stat.count) / totalReviews) * 100).toFixed(2))
            : 0,
      })),
      totalReviews,
      averageRating:
        totalReviews > 0
          ? Number(
              (
                ratingStats.reduce(
                  (sum, stat) =>
                    sum + parseInt(stat.rating) * parseInt(stat.count),
                  0,
                ) / totalReviews
              ).toFixed(2),
            )
          : 0,
    };
  }

  async getEBooksRatingStats() {
    const ratingStats = await this.reviewBookRepository
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .groupBy('review.rating')
      .getRawMany();

    const totalReviews = ratingStats.reduce(
      (sum, stat) => sum + parseInt(stat.count),
      0,
    );

    return {
      ratingStats: ratingStats.map((stat) => ({
        rating: parseInt(stat.rating),
        count: parseInt(stat.count),
        percentage:
          totalReviews > 0
            ? Number(((parseInt(stat.count) / totalReviews) * 100).toFixed(2))
            : 0,
      })),
      totalReviews,
      averageRating:
        totalReviews > 0
          ? Number(
              (
                ratingStats.reduce(
                  (sum, stat) =>
                    sum + parseInt(stat.rating) * parseInt(stat.count),
                  0,
                ) / totalReviews
              ).toFixed(2),
            )
          : 0,
    };
  }
}
