import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Permission, Role } from 'src/databases/typeorm/entities';
import { MessageResponseDto, MessageWithDataResponseDto } from 'src/common/dto/response';
import { I18nService } from 'nestjs-i18n';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { BasePaginationResponseDto } from 'src/common/dto/response';
import { AssignPermissionDto } from './dto/request/assign-permission.dto';
import { RoleMapper } from './mapper/role.mapper';
import { RoleResponseDto } from './dto/response/role.res.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly i18n: I18nService,
  ) { }


  async create(createRoleDto: CreateRoleDto): Promise<MessageWithDataResponseDto<RoleResponseDto>> {
    const role = RoleMapper.toEntityFromCreateDto(createRoleDto);

    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findBy({
        id: In(createRoleDto.permissionIds)
      });
      role.permissions = permissions;
    }

    const savedRole = await this.roleRepository.save(role);

    return new MessageWithDataResponseDto(
      this.i18n.t('messages.ROLE.CREATED'),
      RoleMapper.toDto(savedRole)
    );
  }

  async findAll({ take, skip, page, limit, sortBy, sortOrder, search }: BasePaginationDto): Promise<BasePaginationResponseDto<RoleResponseDto>> {
    const allowedSortFields: string[] = ['id', 'name', 'createdAt', 'updatedAt'];

    if (!allowedSortFields.includes(sortBy)) {
      throw new BadRequestException(this.i18n.t('errors.VALIDATION.INVALID_SORT_BY'));
    }

    const [roles, total] = await this.roleRepository.findAndCount({
      select: {
        permissions: {
          id: true,
          name: true,
        }
      },
      relations: {
        permissions: true,
      },
      where: search ? [
        { name: ILike(`%${search}%`) },
      ] : undefined,
      order: {
        [sortBy]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
      },
      skip,
      take,
    });

    return new BasePaginationResponseDto(RoleMapper.toDtoList(roles), { total, page, limit });
  }

  async findOne(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({ where: { id }, relations: { permissions: true } });
    if (!role) {
      throw new NotFoundException(this.i18n.t('errors.ROLE.NOT_FOUND'));
    }
    return RoleMapper.toDto(role);
  }


  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<MessageWithDataResponseDto<RoleResponseDto>> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: true }
    });

    if (!role) {
      throw new NotFoundException(this.i18n.t('errors.ROLE.NOT_FOUND'));
    }

    const updatedRole = RoleMapper.toEntityFromUpdateDto(updateRoleDto, role);

    if (updateRoleDto.permissionIds && updateRoleDto.permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findBy({
        id: In(updateRoleDto.permissionIds)
      });
      updatedRole.permissions = permissions;

    }

    await this.roleRepository.save(updatedRole);
    return new MessageWithDataResponseDto(
      this.i18n.t('messages.ROLE.UPDATED'),
      RoleMapper.toDto(updatedRole)
    );
  }

  async remove(id: number): Promise<MessageResponseDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(this.i18n.t('errors.ROLE.NOT_FOUND'));
    }
    await this.roleRepository.delete(id);
    return new MessageResponseDto(this.i18n.t('messages.ROLE.REMOVED'));
  }

  async assignPermissions(id: number, assignPermissionDto: AssignPermissionDto): Promise<MessageResponseDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(this.i18n.t('errors.ROLE.NOT_FOUND'));
    }
    const permissions = await this.permissionRepository.find({ where: { id: In(assignPermissionDto.permissionIds) } });
    role.permissions = permissions;
    await this.roleRepository.save(role);
    return new MessageResponseDto(this.i18n.t('messages.ROLE.PERMISSIONS_ASSIGNED'));
  }

  async list(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find();
    return RoleMapper.toDtoList(roles);
  }
}
