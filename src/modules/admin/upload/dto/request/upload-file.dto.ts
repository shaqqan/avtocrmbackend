import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { UploadTypeEnum } from "src/common/enums/admin";

export class UploadFileDto {
    @ApiProperty({
        description: 'The file to upload',
        type: 'string',
        format: 'binary',
    })
    file: any;

    @ApiProperty({
        description: 'The type of the file',
        enum: UploadTypeEnum,
        example: UploadTypeEnum.LANGUAGE,
    })
    type: string;
}
