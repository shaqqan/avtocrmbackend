import { BookLangEnum, PublishedEnum } from 'src/databases/typeorm/entities';

export class BookResponseDto {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public descriptionShort: string,
    public lang: BookLangEnum,
    public ISBN: string,
    public top: number,
    public cover: string,
    public year: number,
    public pages: number,
    public published: PublishedEnum,
    public createdAt: string | Date,
    public authors: string[],
    public files: string[],
    public genres: string[],
    public issuers: string[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.descriptionShort = descriptionShort;
    this.lang = lang;
    this.ISBN = ISBN;
    this.top = top;
    this.cover = cover;
    this.year = year;
    this.pages = pages;
    this.published = published;
    this.createdAt = createdAt;
    this.authors = authors;
    this.files = files;
    this.genres = genres;
    this.issuers = issuers;
  }
}

export class BookResponseMultiLangDto {
  constructor(
    public id: number,
    public name_uz: string,
    public name_ru: string,
    public name_en: string,
    public description_uz: string,
    public description_ru: string,
    public description_en: string,
    public description_short_uz: string,
    public description_short_ru: string,
    public description_short_en: string,
    public lang: BookLangEnum,
    public ISBN: string,
    public top: number,
    public cover: string,
    public year: number,
    public pages: number,
    public published: PublishedEnum,
    public createdAt: string | Date,
    public authors: string[],
    public files: string[],
    public genres: string[],
    public issuers: string[],
  ) {
    this.id = id;
    this.name_uz = name_uz;
    this.name_ru = name_ru;
    this.name_en = name_en;
    this.description_uz = description_uz;
    this.description_ru = description_ru;
    this.description_en = description_en;
    this.description_short_uz = description_short_uz;
    this.description_short_ru = description_short_ru;
    this.description_short_en = description_short_en;
    this.lang = lang;
    this.ISBN = ISBN;
    this.top = top;
    this.cover = cover;
    this.year = year;
    this.pages = pages;
    this.published = published;
    this.createdAt = createdAt;
    this.authors = authors;
    this.files = files;
    this.genres = genres;
    this.issuers = issuers;
  }
}
