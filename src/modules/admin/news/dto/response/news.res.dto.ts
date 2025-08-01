import { NewsStatus } from "src/databases/typeorm/entities/news.entity";

export class NewsResponseDto {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public cover: string,
        public status: NewsStatus,
        public createdAt: Date,
        public updatedAt: Date,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.cover = cover;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class NewsMultiResponseDto {
    constructor(
        public id: number,
        public title_uz: string,
        public title_ru: string,
        public title_en: string,
        public description_uz: string,
        public description_ru: string,
        public description_en: string,
        public cover: string,
        public status: NewsStatus,
        public createdAt: Date,
        public updatedAt: Date,
    ) {
        this.id = id;
        this.title_uz = title_uz;
        this.title_ru = title_ru;
        this.title_en = title_en;
        this.description_uz = description_uz;
        this.description_ru = description_ru;
        this.description_en = description_en;
        this.cover = cover;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}