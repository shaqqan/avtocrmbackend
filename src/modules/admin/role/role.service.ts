import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Permission, Role } from 'src/databases/typeorm/entities';
import { MessageWithDataResponseDto } from 'src/common/dto/response';
import { I18nService } from 'nestjs-i18n';
import { BasePaginationDto, SortOrder } from 'src/common/dto/request';
import { BasePaginationResponseDto } from 'src/common/dto/response';
import { AssignPermissionDto } from './dto/assign-permission.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly i18n: I18nService,
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return new MessageWithDataResponseDto(this.i18n.t('messages.ROLE.CREATED'), role);
  }

  async findAll({ take, skip, page, limit, sortBy, sortOrder, search }: BasePaginationDto) {
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
        { id: Number(search) },
        { name: ILike(`%${search}%`) },
      ] : undefined,
      order: {
        [sortBy]: sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
      },
      skip,
      take,
    });

    return new BasePaginationResponseDto(roles, { total, page, limit });
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(this.i18n.t('errors.ROLE.NOT_FOUND'));
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(this.i18n.t('errors.ROLE.NOT_FOUND'));
    }
    return new MessageWithDataResponseDto(this.i18n.t('messages.ROLE.UPDATED'), role);
  }

  async remove(id: number) {
    await this.roleRepository.delete(id);
    return new MessageWithDataResponseDto(this.i18n.t('messages.ROLE.DELETED'));
  }

  async assignPermissions(id: number, assignPermissionDto: AssignPermissionDto) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(this.i18n.t('errors.ROLE.NOT_FOUND'));
    }
    const permissions = await this.permissionRepository.find({ where: { id: In(assignPermissionDto.permissionIds) } });
    role.permissions = permissions;
    await this.roleRepository.save(role);
    return new MessageWithDataResponseDto(this.i18n.t('messages.ROLE.PERMISSIONS_ASSIGNED'), role);
  }
}
