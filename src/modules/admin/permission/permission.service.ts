import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { Permission } from '../../../databases/typeorm/entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { I18nService } from 'nestjs-i18n';
import { BasePaginationResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        private readonly i18n: I18nService,
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<MessageWithDataResponseDto> {
        const permission = this.permissionRepository.create(createPermissionDto);
        await this.permissionRepository.save(permission);
        return new MessageWithDataResponseDto(this.i18n.t('messages.PERMISSION.CREATED'), permission);
    }

    async findAll({ take, skip, page, limit, sortBy, sortOrder, search }: BasePaginationDto): Promise<BasePaginationResponseDto> {
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
        return new BasePaginationResponseDto(permissions, { total, page, limit });
    }

    async findOne(id: number): Promise<Permission> {
        const permission = await this.permissionRepository.findOne({
            where: { id },
        });

        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }

        return permission;
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
        const permission = await this.findOne(id);
        Object.assign(permission, updatePermissionDto);
        return await this.permissionRepository.save(permission);
    }

    async remove(id: number): Promise<void> {
        const permission = await this.findOne(id);
        await this.permissionRepository.softRemove(permission);
    }
} 