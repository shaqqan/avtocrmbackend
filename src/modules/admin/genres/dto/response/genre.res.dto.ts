export class GenreResponseDto {
  constructor(
    public id: number,
    public parentId: number | null,
    public cover: string,
    public name: string,
    public description: string,
    public createdAt: Date,
    public updatedAt: Date,
    public children?: GenreResponseDto[],
  ) {
    this.id = id;
    this.parentId = parentId;
    this.cover = cover;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.children = children;
  }
}

export class GenreResponseMultiLangDto {
  constructor(
    public id: number,
    public parentId: number | null,
    public cover: string,
    public name_uz: string,
    public name_ru: string,
    public name_en: string,
    public description_uz: string,
    public description_ru: string,
    public description_en: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    this.id = id;
    this.parentId = parentId;
    this.cover = cover;
    this.name_uz = name_uz;
    this.name_ru = name_ru;
    this.name_en = name_en;
    this.description_uz = description_uz;
    this.description_ru = description_ru;
    this.description_en = description_en;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class GenreListResponseDto {
  constructor(
    public id: number,
    public parentId: number | null,
    public name: string,
  ) {
    this.id = id;
    this.parentId = parentId;
    this.name = name;
  }
}
