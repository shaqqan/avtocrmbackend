import { AutoModels } from 'src/databases/typeorm/entities';

export class AutoBrandResponseDto {
  constructor(
    public id: number,
    public name: string,
    public models: AutoModels[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.models = models;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
