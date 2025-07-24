import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthAdminAccessGuard extends AuthGuard(
  'jwt-admin-access',
) { }
