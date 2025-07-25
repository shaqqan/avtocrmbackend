import { BookLangEnum, PublishedEnum } from "src/databases/typeorm/entities";

export class BookWithLocalesResponseDto {
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
        public lang: BookLangEnum,
        public ISBN: string,
        public top: number,
        public cover: string,
        public year: number,
        public pages: number,
        public published: PublishedEnum,
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
        this.top = top;
        this.cover = cover;
        this.year = year;
        this.pages = pages;
        this.published = published;
    }
}