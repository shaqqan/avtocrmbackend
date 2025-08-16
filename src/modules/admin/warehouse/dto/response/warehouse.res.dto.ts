export class WarehouseResponseDto {
  constructor(
    public id: number,
    public name: string,
    public address: string,
    public location: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.location = location;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
