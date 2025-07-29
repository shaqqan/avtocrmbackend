import { Role } from "src/databases/typeorm/entities";

export class UserResponseDto {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public email: string,
        public roles: string[],
        public createdAt: Date,
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
        this.createdAt = createdAt;
    }
}