import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, In } from 'typeorm';
import { User, Role } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationDto } from 'src/common/dto/request';
import {
  BasePaginationResponseDto,
  MessageResponseDto,
  MessageWithDataResponseDto,
} from 'src/common/dto/response';
import { UserMapper } from './mapper/user.mapper';
import * as bcrypt from 'bcrypt';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly i18n: I18nService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // Check if phone already exists
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });

    if (existingUser) {
      throw new BadRequestException(
        this.i18n.t('errors.USER.PHONE_ALREADY_EXISTS'),
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Validate and get roles if provided
    let roles: Role[] = [];
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      roles = await this.roleRepository.findBy({
        id: In(createUserDto.roleIds),
      });
      if (roles.length !== createUserDto.roleIds.length) {
        throw new BadRequestException(this.i18n.t('errors.USER.INVALID_ROLES'));
      }
    }

    // Create user entity
    const user = this.userRepository.create({
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      password: hashedPassword,
      roles: roles,
    });

    const savedUser = await this.userRepository.save(user);

    // Fetch user with relations for response
    const userWithRoles = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: { roles: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.USER.CREATED'),
      UserMapper.toDto(userWithRoles!),
    );
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;

    const allowedSortFields = [
      'id',
      'name',
      'lastName',
      'phone',
      'createdAt',
    ];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    // Validate sortOrder
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder?.toUpperCase())
      ? (sortOrder.toUpperCase() as 'ASC' | 'DESC')
      : 'DESC';

    // Build where conditions for search
    const whereConditions: any[] = [];
    if (search) {
      whereConditions.push(
        { name: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { phone: ILike(`%${search}%`) },
      );
    }

    const [users, total] = await this.userRepository.findAndCount({
      select: {
        id: true,
        name: true,
        lastName: true,
        phone: true,
        createdAt: true,
        roles: {
          id: true,
          name: true,
        },
      },
      where: whereConditions.length > 0 ? whereConditions : undefined,
      order: {
        [validSortBy]: validSortOrder,
      },
      take,
      skip,
    });

    return new BasePaginationResponseDto(UserMapper.toDtoList(users), {
      total,
      page,
      limit,
    });
  }

  public async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
    if (!user) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return UserMapper.toDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { roles: true },
    });

    if (!user) {
      throw new NotFoundException(this.i18n.t('errors.USER.NOT_FOUND'));
    }

    // Check if phone is being changed and if it already exists
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUser = await this.userRepository.findOne({
        where: { phone: updateUserDto.phone },
      });

      if (existingUser) {
        throw new BadRequestException(
          this.i18n.t('errors.USER.PHONE_ALREADY_EXISTS'),
        );
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update roles if provided
    let roles: Role[] = user.roles;
    if (updateUserDto.roleIds !== undefined) {
      if (updateUserDto.roleIds.length > 0) {
        roles = await this.roleRepository.findBy({
          id: In(updateUserDto.roleIds),
        });
        if (roles.length !== updateUserDto.roleIds.length) {
          throw new BadRequestException(
            this.i18n.t('errors.USER.INVALID_ROLES'),
          );
        }
      } else {
        roles = [];
      }
    }

    // Update user
    const updatedUser = await this.userRepository.save({
      ...user,
      ...UserMapper.toEntityFromUpdateDto(updateUserDto, user),
      roles: roles,
    });

    // Fetch updated user with relations
    const userWithRoles = await this.userRepository.findOne({
      where: { id: updatedUser.id },
      relations: { roles: true },
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.USER.UPDATED'),
      UserMapper.toDto(userWithRoles!),
    );
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(this.i18n.t('errors.USER.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.userRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.USER.DELETED'));
  }
}
