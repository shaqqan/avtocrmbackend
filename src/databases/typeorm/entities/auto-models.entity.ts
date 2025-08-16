import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { AutoBrand } from "./auto-brand.entity";
import { AutoPosition } from "./auto-position.entity";

@Entity('auto_models')
export class AutoModels extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brandId: number;

  @ManyToOne(() => AutoBrand, (brand) => brand.models)
  brand: AutoBrand;

  @OneToMany(() => AutoPosition, (position) => position.autoModel)
  positions: AutoPosition[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}   