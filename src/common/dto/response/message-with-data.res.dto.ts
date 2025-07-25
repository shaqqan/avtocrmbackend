export class MessageWithDataResponseDto<T> {
    constructor(
        public message: string,
        public data: T,
    ) { }
}