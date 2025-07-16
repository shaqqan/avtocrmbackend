import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';
import { PERMISSIONS_KEY } from '../constants';

export const RequirePermissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions); 