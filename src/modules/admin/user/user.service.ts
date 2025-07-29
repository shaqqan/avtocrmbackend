import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { User } from 'src/databases/typeorm/entities';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { BasePaginationDto } from 'src/common/dto/request';
import { BasePaginationResponseDto } from 'src/common/dto/response';
import { UserMapper } from './mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  public async findAll(query: BasePaginationDto) {
    const { take, skip, page, limit, sortBy, sortOrder, search } = query;

    const allowedSortFields = [
      'id', 'firstName', 'lastName', 'email',
      'createdAt'
    ];

    // Validate sortBy field
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    // Validate sortOrder
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder?.toUpperCase())
      ? sortOrder.toUpperCase() as 'ASC' | 'DESC'
      : 'DESC';


    // Build where conditions for search
    const whereConditions: any[] = [];
    if (search) {
      whereConditions.push(
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) }
      );
    }

    const [users, total] = await this.userRepository.findAndCount({
      relations: {
        roles: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
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

    return new BasePaginationResponseDto(
      UserMapper.toDtoList(users),
      {
        total,
        page,
        limit,
      }
    );
  }

  public async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        roles: true,
      },
    });
    if (!user) {
      throw new NotFoundException(this.i18n.t('errors.NOT_FOUND'));
    }
    return UserMapper.toDto(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
