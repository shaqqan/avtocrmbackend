import { AudioBookResponseDto, AudioBookResponseMultiLangDto } from '../dto/response/audio-book.res.dto';
import { CreateAudioBookDto } from '../dto/request/create-audio-book.dto';
import { UpdateAudioBookDto } from '../dto/request/update-audio-book.dto';
import { I18nContext } from 'nestjs-i18n';
import { AudioBook } from 'src/databases/typeorm/entities';

export class AudioBookMapper {
    static toDto(entity: AudioBook): AudioBookResponseMultiLangDto {
        const locale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return new AudioBookResponseMultiLangDto(
            entity.id,
            entity.name_uz,
            entity.name_ru,
            entity.name_en,
            entity.description_uz,
            entity.description_ru,
            entity.description_en,
            entity.description_short_uz,
            entity.description_short_ru,
            entity.description_short_en,
            entity.lang,
            entity.ISBN,
            entity.duration,
            entity.top,
            entity.cover,
            entity.year,
            entity.published,
            entity.createdAt,
            entity.updatedAt,
            entity.authors.map(author => author.getFullName(locale)),
            entity.files?.map(file => file.name),
            entity.genres?.map(genre => genre[`name_${locale}`]),
            entity.issuers?.map(issuer => issuer[`name_${locale}`])
        );
    }

    static toEntityFromCreateDto(dto: CreateAudioBookDto): AudioBook {
        const audioBook = new AudioBook();
        // Copy all properties except relationship IDs
        const { authorsIds, genresIds, issuersIds, filesIds, ...audioBookData } = dto;
        Object.assign(audioBook, audioBookData);
        return audioBook;
    }

    static toEntityFromUpdateDto(dto: UpdateAudioBookDto, existingAudioBook: AudioBook): AudioBook {
        // Copy all properties except relationship IDs
        const { authorsIds, genresIds, issuersIds, filesIds, ...audioBookData } = dto;
        return Object.assign(existingAudioBook, audioBookData);
    }

    static toDtoList(entities: AudioBook[]): AudioBookResponseDto[] {
        const locale = I18nContext.current()?.lang?.split('_')[0] || 'uz';
        return entities.map(entity => new AudioBookResponseDto(
            entity.id,
            entity.getName(locale),
            entity.getDescriptionShort(locale),
            entity.lang,
            entity.ISBN,
            entity.duration,
            entity.top,
            entity.cover,
            entity.year,
            entity.published,
            entity.createdAt,
            entity.updatedAt,
            entity.authors.map(author => author.getFullName(locale)),
            entity.files?.map(file => file.name),
            entity.genres?.map(genre => genre[`name_${locale}`]),
            entity.issuers?.map(issuer => issuer[`name_${locale}`])
        ));
    }
}