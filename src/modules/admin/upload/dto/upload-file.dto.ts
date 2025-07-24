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

    @ApiProperty()
    @IsEnum(UploadTypeEnum)
    type: UploadTypeEnum;
}
