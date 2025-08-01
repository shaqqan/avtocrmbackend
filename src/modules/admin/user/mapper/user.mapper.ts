import { User } from "src/databases/typeorm/entities";
import { UserResponseDto } from "../dto/response/user.res.dto";
import { CreateUserDto } from "../dto/request/create-user.dto";
import { UpdateUserDto } from "../dto/request/update-user.dto";

export class UserMapper {
    static toDto(entity: User): UserResponseDto {
        return new UserResponseDto(
            entity.id,
            entity.name,
            entity.lastName,
            entity.email,
            entity.roles,
            entity.createdAt,
        );
    }

    static toDtoList(entities: User[]): UserResponseDto[] {
        return entities.map(entity => this.toDto(entity));
    }

    static toEntityFromCreateDto(dto: CreateUserDto): User {
        const user = new User();
        Object.assign(user, dto);
        return user;
    }

    static toEntityFromUpdateDto(dto: UpdateUserDto, existingUser: User): User {
        return Object.assign(existingUser, dto);
    }

}