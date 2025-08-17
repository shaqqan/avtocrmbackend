import { AutoModels } from 'src/databases/typeorm/entities';

export class AutoColorResponseDto {
  constructor(
    public id: number,
    public name: string,
    public autoModelId: number,
    public autoModel: AutoModels,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.autoModelId = autoModelId;
    this.autoModel = autoModel;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
