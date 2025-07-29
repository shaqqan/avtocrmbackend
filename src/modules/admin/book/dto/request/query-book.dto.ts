import { BasePaginationDto } from "src/common/dto/request";
import { IsNumber, IsOptional } from "class-validator";
import { Exists } from "src/common/decorators/validators";
import { Author, Genre, Issuer } from "src/databases/typeorm/entities";
import { ApiProperty } from "@nestjs/swagger";

export class QueryBookDto extends BasePaginationDto {

    @ApiProperty({
        description: 'Author ID',
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Exists(Author, 'id')
    authorId: number;

    @ApiProperty({
        description: 'Genre ID',
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Exists(Genre, 'id')
    genreId: number;

    @ApiProperty({
        description: 'Issuer ID',
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Exists(Issuer, 'id')
    issuerId: number;
}