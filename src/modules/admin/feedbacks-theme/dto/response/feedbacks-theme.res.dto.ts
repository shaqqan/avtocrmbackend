export class FeedbacksThemeResponseDto {
  constructor(
    public id: number,
    public name: string,
    public createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
  }
}

export class FeedbacksThemeMultiLanguageResponseDto {
  constructor(
    public id: number,
    public name_uz: string,
    public name_ru: string,
    public name_en: string,
    public createdAt: Date,
  ) {
    this.id = id;
    this.name_uz = name_uz;
    this.name_ru = name_ru;
    this.name_en = name_en;
    this.createdAt = createdAt;
  }
}
