import { ApiProperty } from "@nestjs/swagger";

export class MessageWithDataResponseDto {
    constructor(message?: string, data?: any) {
        if (message) {
            this.message = message;
        }
        if (data) {
            this.data = data;
        }
    }

    @ApiProperty({
        description: 'The message',
        example: 'Message',
    })
    message: string;

    @ApiProperty()
    data?: any | null;
}