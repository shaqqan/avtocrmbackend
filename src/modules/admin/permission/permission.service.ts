import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { Permission } from '../../../databases/typeorm/entities/permission.entity';
import { CreatePermissionDto } from './dto/request/create-permission.dto';
import { UpdatePermissionDto } from './dto/request/update-permission.dto';
import { I18nService } from 'nestjs-i18n';
import { BasePaginationResponseDto, MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { PermissionMapper } from './mapper/permission.mapper';
import { PermissionResponseDto } from './dto/response/permission.res.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        private readonly i18n: I18nService,
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<MessageWithDataResponseDto<PermissionResponseDto>> {
        const permission = PermissionMapper.toEntityFromCreateDto(createPermissionDto);
        const savedPermission = await this.permissionRepository.save(permission);
        return new MessageWithDataResponseDto(this.i18n.t('messages.PERMISSION.CREATED'), PermissionMapper.toDto(savedPermission));
    }

    async findAll({ take, skip, page, limit, sortBy, sortOrder, search }: BasePaginationDto): Promise<BasePaginationResponseDto<PermissionResponseDto>> {
        const allowedSortFields: string[] = ['id', 'name', 'action', 'subject', 'createdAt', 'updatedAt'];

        if (!allowedSortFields.includes(sortBy)) {
            throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'));
        }

        const [permissions, total] = await this.permissionRepository.findAndCount({
            where: search ? [
                { name: ILike(`%${search}%`) },
                { action: ILike(`%${search}%`) },
            ] : undefined,
            order: {
                [sortBy]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
            },
            skip,
            take,
        });

        return new BasePaginationResponseDto(PermissionMapper.toDtoList(permissions), { total, page, limit });
    }

    async findOne(id: number): Promise<PermissionResponseDto> {
        const permission = await this.permissionRepository.findOne({
            where: { id },
        });

        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }

        return PermissionMapper.toDto(permission);
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<MessageWithDataResponseDto<PermissionResponseDto>> {
        const permission = await this.permissionRepository.findOne({
            where: { id },
        });

        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        const updatedPermission = PermissionMapper.toEntityFromUpdateDto(updatePermissionDto, permission);
        const savedPermission = await this.permissionRepository.save(updatedPermission);
        return new MessageWithDataResponseDto(this.i18n.t('messages.PERMISSION.UPDATED'), PermissionMapper.toDto(savedPermission));
    }

    async remove(id: number): Promise<MessageResponseDto> {
        const permission = await this.permissionRepository.findOne({
            where: { id },
        });

        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }
        await this.permissionRepository.softRemove(permission);
        return new MessageResponseDto(this.i18n.t('messages.PERMISSION.REMOVED'));
    }

    async list(): Promise<PermissionResponseDto[]> {
        const permissions = await this.permissionRepository.find();
        return PermissionMapper.toDtoList(permissions);
    }
} 