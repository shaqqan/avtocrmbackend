import { PartialType } from '@nestjs/swagger';
import { CreateIssuerDto } from './create-issuer.dto';

export class UpdateIssuerDto extends PartialType(CreateIssuerDto) {}
