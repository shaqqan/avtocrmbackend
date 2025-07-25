export class UploadResponseDto {
    constructor(
        public id: number,
        public path: string,
        public name: string,
        public type: string,
        public size: number,
        public createdAt: Date,
        public updatedAt: Date,
    ) {
    }
}