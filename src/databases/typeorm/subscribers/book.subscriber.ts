import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, SoftRemoveEvent, UpdateEvent } from "typeorm";
import { Book } from "../entities";
import { RedisService } from "src/databases/redis/redis.service";

@EventSubscriber()
export class BookSubscriber implements EntitySubscriberInterface<Book> {
    constructor(private readonly redisService: RedisService) {
    }
    afterInsert(event: InsertEvent<Book>) {
        // this.redisService.delete('core:statistics');
    }
    afterUpdate(event: UpdateEvent<Book>) {
        // this.redisService.delete('core:statistics');
    }

    afterRemove(event: RemoveEvent<Book>) {
        // this.redisService.delete('core:statistics');
    }

    afterSoftRemove(event: SoftRemoveEvent<Book>) {
        // this.redisService.delete('core:statistics');
    }
}