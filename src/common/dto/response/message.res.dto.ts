import { ApiProperty } from "@nestjs/swagger";

export class MessageResponseDto {
    constructor(message: string) {
        this.message = message;
    }

    @ApiProperty({
        description: 'The message',
        example: 'Language removed successfully',
    })
    message: string;
}