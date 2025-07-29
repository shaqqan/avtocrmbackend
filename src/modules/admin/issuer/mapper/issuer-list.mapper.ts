import { Issuer } from "src/databases/typeorm/entities";
import { IssuerListResponseDto } from "../dto/response/issuer.res.dto";
import { I18nContext } from "nestjs-i18n";

export class IssuerListMapper {
    static toDto(entity: Issuer): IssuerListResponseDto {
        const locale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return new IssuerListResponseDto(
            entity.id,
            entity[`name_${locale}`],
        );
    }
    static toDtoList(entities: Issuer[]): IssuerListResponseDto[] {
        return entities.map(entity => this.toDto(entity));
    }

}
