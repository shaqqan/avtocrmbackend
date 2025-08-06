export class HelpResponseDto {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
  }
}

export class HelpMultiLangResponseDto {
  constructor(
    public id: number,
    public name_uz: string,
    public name_ru: string,
    public name_en: string,
    public description_uz: string,
    public description_ru: string,
    public description_en: string,
    public createdAt: Date,
  ) {
    this.id = id;
    this.name_uz = name_uz;
    this.name_ru = name_ru;
    this.name_en = name_en;
    this.description_uz = description_uz;
    this.description_ru = description_ru;
    this.description_en = description_en;
    this.createdAt = createdAt;
  }
}
