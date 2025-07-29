import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { FileCategory, FileFormat } from "src/common/enums";

export class UploadFileDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;

    @ApiProperty({ enum: FileCategory })
    category: FileCategory;

    @ApiProperty({ enum: FileFormat })
    format: FileFormat;
}
