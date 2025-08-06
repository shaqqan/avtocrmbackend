export class PermissionResponseDto {
  constructor(
    public id: number,
    public name: string | object,
    public action: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
