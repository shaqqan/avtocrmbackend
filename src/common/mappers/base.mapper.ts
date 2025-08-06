export interface IBaseMapper<E, D> {
  toDto(entity: E, ...args: any[]): D;
  toEntity(dto: D, ...args: any[]): E;
  toDtoList(entities: E[], ...args: any[]): D[];
  toEntityList(dtos: D[], ...args: any[]): E[];
}
