import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import type { Permission } from '../enums/permission.enum';
import { PERMISSIONS_KEY } from '../constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException(this.i18n.t('errors.FORBIDDEN.PERMISSIONS'));
    }

    // Get user's direct permissions
    const userPermissions =
      user.permissions?.map((p) => p.permission.name) || [];

    // Get permissions from user's roles
    const rolePermissions =
      user.roles?.flatMap(
        (r) => r.role.permissions?.map((p) => p.permission.name) || [],
      ) || [];

    // Combine all permissions
    const allPermissions = [
      ...new Set([...userPermissions, ...rolePermissions]),
    ];

    const hasPermission = requiredPermissions.every((permission) =>
      allPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(this.i18n.t('errors.FORBIDDEN.PERMISSIONS'));
    }

    return true;
  }
}
