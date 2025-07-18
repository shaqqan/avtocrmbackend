import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

/**
 * get logged user custom decorator
 */
export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<User> => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
