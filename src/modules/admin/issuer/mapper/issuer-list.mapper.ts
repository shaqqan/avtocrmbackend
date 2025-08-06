import { Issuer } from 'src/databases/typeorm/entities';
import { IssuerListResponseDto } from '../dto/response/issuer.res.dto';
import { I18nContext } from 'nestjs-i18n';
import { currentLocale } from 'src/common/utils';

export class IssuerListMapper {
  static toDto(entity: Issuer): IssuerListResponseDto {
    const locale = currentLocale();
    return new IssuerListResponseDto(entity.id, entity[`name_${locale}`]);
  }
  static toDtoList(entities: Issuer[]): IssuerListResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
