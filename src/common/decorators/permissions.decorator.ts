import { SetMetadata } from '@nestjs/common';
import { PermissionsEnum } from '../enums';
import { PERMISSIONS_KEY } from '../constants';

export const RequirePermissions = (...permissions: PermissionsEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);  
