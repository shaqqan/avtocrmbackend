import { AutoBrand } from 'src/databases/typeorm/entities';

export class AutoModelResponseDto {
  constructor(
    public id: number,
    public name: string,
    public brandId: number,
    public brand: AutoBrand,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.brandId = brandId;
    this.brand = brand;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
