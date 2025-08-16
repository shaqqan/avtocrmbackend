import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AutoModels } from "./auto-models.entity";

@Entity('auto_positions')
export class AutoPosition extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  autoModelId: number;

  @ManyToOne(() => AutoModels, (autoModel) => autoModel.positions)
  autoModel: AutoModels;
  
  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
