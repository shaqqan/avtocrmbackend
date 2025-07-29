import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { UploadService } from './upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './dto/request/upload-file.dto';
import { FastifyRequest, FastifyBodyParser } from 'fastify';
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
  async uploadFileManual(@Req() req: FastifyRequest & { body: any }) {
    const category = req.body.category;
    const format = req.body.format;
    return await this.uploadService.uploadFile(req, { category, format });
  }
}
