export class AuthorResponseWithMultiLangDto {
  constructor(
    public id: number,
    public name_uz: string,
    public lastName_uz: string,
    public middleName_uz: string,
    public name_ru: string,
    public lastName_ru: string,
    public middleName_ru: string,
    public name_en: string,
    public lastName_en: string,
    public middleName_en: string,
    public description_uz: string,
    public description_ru: string,
    public description_en: string,
    public cover: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.name_uz = name_uz;
    this.lastName_uz = lastName_uz;
    this.middleName_uz = middleName_uz;
    this.name_ru = name_ru;
    this.lastName_ru = lastName_ru;
    this.middleName_ru = middleName_ru;
    this.name_en = name_en;
    this.lastName_en = lastName_en;
    this.middleName_en = middleName_en;
    this.description_uz = description_uz;
    this.description_ru = description_ru;
    this.description_en = description_en;
    this.cover = cover;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class AuthorResponseDto {
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public middleName: string,
    public description: string,
    public cover: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.middleName = middleName;
    this.description = description;
    this.cover = cover;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class AuthorListResponseDto {
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public middleName: string,
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.middleName = middleName;
  }
}
