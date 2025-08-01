import { AudioBookLangEnum, AudioBookPublishedEnum } from "src/databases/typeorm/entities";

export class AudioBookResponseDto {
    constructor(
        public id: number,
        public name: string,
        public descriptionShort: string,
        public lang: AudioBookLangEnum,
        public ISBN: string,
        public duration: number,
        public top: number,
        public cover: string,
        public year: number,
        public published: AudioBookPublishedEnum,
        public createdAt: string | Date,
        public updatedAt: string | Date,
        public authors: string[],
        public files: string[],
        public genres: string[],
        public issuers: string[]
    ) {
        this.id = id;
        this.name = name;
        this.descriptionShort = descriptionShort;
        this.lang = lang;
        this.ISBN = ISBN;
        this.duration = duration;
        this.top = top;
        this.cover = cover;
        this.year = year;
        this.published = published;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authors = authors;
        this.files = files;
        this.genres = genres;
        this.issuers = issuers;
    }
}

export class AudioBookResponseMultiLangDto {
    constructor(
        public id: number,
        public name_uz: string,
        public name_ru: string,
        public name_en: string,
        public description_uz: string,
        public description_ru: string,
        public description_en: string,
        public descriptionShort_uz: string,
        public descriptionShort_ru: string,
        public descriptionShort_en: string,
        public lang: AudioBookLangEnum,
        public ISBN: string,
        public duration: number,
        public top: number,
        public cover: string,
        public year: number,
        public published: AudioBookPublishedEnum,
        public createdAt: string | Date,
        public updatedAt: string | Date,
        public authors: string[],
        public files: string[],
        public genres: string[],
        public issuers: string[]
    ) {
        this.id = id;
        this.name_uz = name_uz;
        this.name_ru = name_ru;
        this.name_en = name_en;
        this.description_uz = description_uz;
        this.description_ru = description_ru;
        this.description_en = description_en;
        this.descriptionShort_uz = descriptionShort_uz;
        this.descriptionShort_ru = descriptionShort_ru;
        this.descriptionShort_en = descriptionShort_en;
        this.lang = lang;
        this.ISBN = ISBN;
        this.duration = duration;
        this.top = top;
        this.cover = cover;
        this.year = year;
        this.published = published;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authors = authors;
        this.files = files;
        this.genres = genres;
        this.issuers = issuers;
    }
}