import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BookAudiobookLinkService } from './book-audiobook-link.service';
import { CreateBookAudiobookLinkDto } from './dto/request/create-book-audiobook-link.dto';
import { UpdateBookAudiobookLinkDto } from './dto/request/update-book-audiobook-link.dto';
import { QueryBookAudiobookLinkDto } from './dto/request/query-book-audiobook-link.dto';
import {
  BookAudiobookLinkResponseDto,
  BookAudiobookLinkSummaryDto,
} from './dto/response/book-audiobook-link.res.dto';
import { MessageWithDataResponseDto } from '../../../common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from '../../../common/dto/response/message.res.dto';
import { BasePaginationResponseDto } from '../../../common/dto/response/base-pagination.res.dto';
import { JwtAuthAdminAccessGuard } from '../../../common/guards/admin/jwt-auth-admin-access.guard';
import { ApiGlobalResponses } from '../../../common/decorators/swagger/swagger-global-response.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { PermissionsEnum } from '../../../common/enums';
import { PermissionsGuard } from '../../../common/guards';

@Controller('admin/book-audiobook-links')
@UseGuards(JwtAuthAdminAccessGuard, PermissionsGuard)
@ApiTags('🔗 Book-AudioBook Link Management')
@ApiBearerAuth()
@ApiGlobalResponses()
export class BookAudiobookLinkController {
  constructor(private readonly linkService: BookAudiobookLinkService) {}

  @Post()
  @RequirePermissions(PermissionsEnum.CREATE_BOOK_AUDIOBOOK_LINK)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new book-audiobook link',
    description:
      'Creates a relationship between a book and an audiobook with specified type and metadata',
  })
  @ApiCreatedResponse({
    description: 'Book-audiobook link created successfully',
    type: BookAudiobookLinkResponseDto,
  })
  async create(
    @Body() createLinkDto: CreateBookAudiobookLinkDto,
  ): Promise<MessageWithDataResponseDto<BookAudiobookLinkResponseDto>> {
    return this.linkService.create(createLinkDto);
  }

  @Get()
  @RequirePermissions(PermissionsEnum.READ_BOOK_AUDIOBOOK_LINK)
  @ApiOperation({
    summary: 'Get all book-audiobook links',
    description:
      'Retrieves a paginated list of book-audiobook links with optional filtering',
  })
  @ApiOkResponse({
    description: 'List of book-audiobook links retrieved successfully',
    type: BasePaginationResponseDto<BookAudiobookLinkResponseDto>,
  })
  async findAll(
    @Query() query: QueryBookAudiobookLinkDto,
  ): Promise<BasePaginationResponseDto<BookAudiobookLinkResponseDto>> {
    return this.linkService.findAll(query);
  }

  @Get('book/:bookId/audiobooks')
  @RequirePermissions(PermissionsEnum.READ_BOOK_AUDIOBOOK_LINK)
  @ApiOperation({
    summary: 'Get audiobooks linked to a specific book',
    description:
      'Retrieves all audiobooks that are linked to the specified book',
  })
  @ApiParam({ name: 'bookId', description: 'Book ID', type: 'number' })
  @ApiOkResponse({
    description: 'Linked audiobooks retrieved successfully',
    type: [BookAudiobookLinkSummaryDto],
  })
  async findAudiobooksForBook(
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<BookAudiobookLinkSummaryDto[]> {
    return this.linkService.findLinksByBookId(bookId);
  }

  @Get('audiobook/:audiobookId/books')
  @RequirePermissions(PermissionsEnum.READ_BOOK_AUDIOBOOK_LINK)
  @ApiOperation({
    summary: 'Get books linked to a specific audiobook',
    description:
      'Retrieves all books that are linked to the specified audiobook',
  })
  @ApiParam({
    name: 'audiobookId',
    description: 'AudioBook ID',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Linked books retrieved successfully',
    type: [BookAudiobookLinkSummaryDto],
  })
  async findBooksForAudiobook(
    @Param('audiobookId', ParseIntPipe) audiobookId: number,
  ): Promise<BookAudiobookLinkSummaryDto[]> {
    return this.linkService.findLinksByAudiobookId(audiobookId);
  }

  @Get(':id')
  @RequirePermissions(PermissionsEnum.READ_BOOK_AUDIOBOOK_LINK)
  @ApiOperation({
    summary: 'Get a book-audiobook link by ID',
    description:
      'Retrieves detailed information about a specific book-audiobook link',
  })
  @ApiParam({ name: 'id', description: 'Link ID', type: 'number' })
  @ApiOkResponse({
    description: 'Book-audiobook link retrieved successfully',
    type: BookAudiobookLinkResponseDto,
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookAudiobookLinkResponseDto> {
    return this.linkService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionsEnum.UPDATE_BOOK_AUDIOBOOK_LINK)
  @ApiOperation({
    summary: 'Update a book-audiobook link',
    description: 'Updates an existing book-audiobook link with new information',
  })
  @ApiParam({ name: 'id', description: 'Link ID', type: 'number' })
  @ApiOkResponse({
    description: 'Book-audiobook link updated successfully',
    type: BookAudiobookLinkResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLinkDto: UpdateBookAudiobookLinkDto,
  ): Promise<MessageWithDataResponseDto<BookAudiobookLinkResponseDto>> {
    return this.linkService.update(id, updateLinkDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionsEnum.DELETE_BOOK_AUDIOBOOK_LINK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a book-audiobook link',
    description: 'Removes a book-audiobook link relationship',
  })
  @ApiParam({ name: 'id', description: 'Link ID', type: 'number' })
  @ApiOkResponse({
    description: 'Book-audiobook link deleted successfully',
    type: MessageResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageResponseDto> {
    return this.linkService.remove(id);
  }
}
