export class PriceListResponseDto {
  constructor(
    public id: number,
    public autoModelId: number,
    public autoModel: any,
    public autoColorId: number,
    public autoColor: any,
    public autoPositionId: number,
    public autoPosition: any,
    public basePrice: number | null,
    public wholesalePrice: number | null,
    public retailPrice: number | null,
    public vat: number | null,
    public margin: number | null,
    public validFrom: Date | null,
    public validTo: Date | null,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.autoModelId = autoModelId;
    this.autoModel = autoModel;
    this.autoColorId = autoColorId;
    this.autoColor = autoColor;
    this.autoPositionId = autoPositionId;
    this.autoPosition = autoPosition;
    this.basePrice = basePrice;
    this.wholesalePrice = wholesalePrice;
    this.retailPrice = retailPrice;
    this.vat = vat;
    this.margin = margin;
    this.validFrom = validFrom;
    this.validTo = validTo;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
