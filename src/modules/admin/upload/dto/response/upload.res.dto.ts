import { FileCategory, FileFormat } from "src/common/enums";

export class UploadResponseDto {
    constructor(
        public id: number,
        public path: string,
        public title_uz: string,
        public title_ru: string,
        public title_en: string,
        public format: FileFormat,
        public category: FileCategory,
        public chapter: number,
        public duration: number,
        public size: number,
        public isActive: boolean,
        public createdAt: Date,
    ) {
    }
}