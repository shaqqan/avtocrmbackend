import { Issuer } from "src/databases/typeorm/entities";
import { IssuerResponseDto, IssuerResponseMultiLangDto } from "../dto/response/issuer.res.dto";
import { CreateIssuerDto } from "../dto/request/create-issuer.dto";
import { I18nContext } from "nestjs-i18n";
import { UpdateIssuerDto } from "../dto/request/update-issuer.dto";

export class IssuerMapper {
    static toDto(entity: Issuer): IssuerResponseMultiLangDto {
        return new IssuerResponseMultiLangDto(
            entity.id,
            entity.name_uz,
            entity.name_ru,
            entity.name_en,
            entity.createdAt,
        );
    }

    static toDtoList(entities: Issuer[]): IssuerResponseDto[] {
        const locale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return entities.map(entity => new IssuerResponseDto(
            entity.id,
            entity[`name_${locale}`],
            entity.createdAt,
        ));
    }

    static toEntityFromCreateDto(dto: CreateIssuerDto): Issuer {
        const issuer = new Issuer();
        Object.assign(issuer, dto);
        return issuer;
    }

    static toEntityFromUpdateDto(dto: UpdateIssuerDto, existingIssuer: Issuer): Issuer {
        return Object.assign(existingIssuer, dto);
    }
}