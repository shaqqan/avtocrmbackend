import { BookLangEnum, PublishedEnum } from "src/databases/typeorm/entities";

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
    }
}