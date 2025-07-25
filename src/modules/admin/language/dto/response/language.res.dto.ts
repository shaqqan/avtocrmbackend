export class LanguageResponseDto {
    constructor(
        public id: number,
        public name: string,
        public locale: string,
        public icon: string | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}