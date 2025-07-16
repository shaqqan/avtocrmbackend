import { SetMetadata } from "@nestjs/common"
import type { Role } from "../enums/role.enum"
import { ROLES_KEY } from "../constants"

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)