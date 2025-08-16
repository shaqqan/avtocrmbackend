import { Warehouse, AutoModels, AutoColor, AutoPosition, StockStatus } from 'src/databases/typeorm/entities';

export class StockResponseDto {
  constructor(
    public id: number,
    public warehouseId: number,
    public warehouse: Warehouse,
    public autoModelId: number,
    public autoModel: AutoModels,
    public autoColorId: number,
    public autoColor: AutoColor,
    public autoPositionId: number,
    public autoPosition: AutoPosition,
    public bodyNumber: string,
    public arrivalDate: Date | null,
    public status: StockStatus,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.warehouseId = warehouseId;
    this.warehouse = warehouse;
    this.autoModelId = autoModelId;
    this.autoModel = autoModel;
    this.autoColorId = autoColorId;
    this.autoColor = autoColor;
    this.autoPositionId = autoPositionId;
    this.autoPosition = autoPosition;
    this.bodyNumber = bodyNumber;
    this.arrivalDate = arrivalDate;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
