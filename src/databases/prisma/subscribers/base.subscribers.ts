import { Prisma } from '@prisma/client';

export abstract class BaseSubscribers {
    public beforeInsert(params: Prisma.MiddlewareParams) {
        console.log('beforeInsert', params);
    }

    public beforeUpdate(params: Prisma.MiddlewareParams) {
        console.log('beforeUpdate', params);
    }

    public beforeDelete(params: Prisma.MiddlewareParams) {
        console.log('beforeDelete', params);
    }
}
