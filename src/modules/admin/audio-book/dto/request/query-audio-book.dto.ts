import { BasePaginationDto } from "src/common/dto/request";
import { IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class QueryAudioBookDto extends BasePaginationDto {
    // Basic query DTO for audio books
    // Can be extended later with specific filter fields if needed
    // For now, inherits search, pagination, and sorting from BasePaginationDto
}