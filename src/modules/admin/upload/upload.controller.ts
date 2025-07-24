import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { UploadService } from './upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';
import { FastifyRequest } from 'fastify';
import { ApiGlobalResponses } from 'src/common/decorators/swagger';
import { JwtAuthAdminAccessGuard } from 'src/common/guards/admin';


@Controller('admin/upload')
@UseGuards(JwtAuthAdminAccessGuard)
@ApiTags('💾 Upload')
@ApiBearerAuth()
@ApiGlobalResponses()
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @ApiOperation({ summary: "Uploads a single file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: 'File upload',
    type: UploadFileDto,
  })
  async uploadFile(@Req() req: FastifyRequest, @Body() body: UploadFileDto): Promise<MessageWithDataResponseDto> {
    return this.uploadService.uploadFile(req, body);
  }
}
