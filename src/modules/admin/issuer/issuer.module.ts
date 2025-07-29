import { Module } from '@nestjs/common';
import { IssuerService } from './issuer.service';
import { IssuerController } from './issuer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issuer } from 'src/databases/typeorm/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Issuer])],
  controllers: [IssuerController],
  providers: [IssuerService],
})
export class IssuerModule {}
