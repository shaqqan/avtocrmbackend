import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { LinkTypeEnum, LinkStatusEnum } from '../../../../../databases/typeorm/entities/book-audiobook-link.entity';
import { Book } from '../../../../../databases/typeorm/entities/book.entity';
import { AudioBook } from '../../../../../databases/typeorm/entities/audio-book.entity';
import { Exists } from 'src/common/decorators/validators';

export class CreateBookAudiobookLinkDto {
    @ApiProperty({ 
        description: 'Book ID to link', 
        example: 1 
    })
    @IsNumber()
    @IsNotEmpty()
    @Exists(Book, 'id', { message: 'errors.BOOK.NOT_FOUND' })
    bookId: number;

    @ApiProperty({ 
        description: 'AudioBook ID to link', 
        example: 2 
    })
    @IsNumber()
    @IsNotEmpty()
    @Exists(AudioBook, 'id', { message: 'errors.AUDIOBOOK.NOT_FOUND' })
    audiobookId: number;

    @ApiProperty({ 
        description: 'Type of relationship between book and audiobook', 
        example: LinkTypeEnum.SAME_CONTENT,
        enum: LinkTypeEnum,
        required: false 
    })
    @IsOptional()
    @IsEnum(LinkTypeEnum)
    linkType?: LinkTypeEnum;

    @ApiProperty({ 
        description: 'Status of the link', 
        example: LinkStatusEnum.ACTIVE,
        enum: LinkStatusEnum,
        required: false 
    })
    @IsOptional()
    @IsEnum(LinkStatusEnum)
    status?: LinkStatusEnum;

    @ApiProperty({ 
        description: 'Optional description of the relationship', 
        example: 'This audiobook is the complete unabridged version of the book',
        maxLength: 500,
        required: false 
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({ 
        description: 'Priority/order of this link (0 = highest priority)', 
        example: 0,
        minimum: 0,
        maximum: 255,
        required: false 
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(255)
    priority?: number;
}