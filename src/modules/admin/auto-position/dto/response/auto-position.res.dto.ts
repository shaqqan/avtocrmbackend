import { AutoModels } from 'src/databases/typeorm/entities';

export class AutoPositionResponseDto { 
  constructor(
    public id: number,
    public autoModelId: number,
    public autoModel: AutoModels,
    public name: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.autoModelId = autoModelId;
    this.autoModel = autoModel;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
