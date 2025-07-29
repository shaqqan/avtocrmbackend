export class HelpResponseDto {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public createdAt: Date,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
    }
}