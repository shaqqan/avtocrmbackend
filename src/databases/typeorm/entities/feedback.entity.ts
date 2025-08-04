import { Column, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, Entity, BaseEntity, AfterLoad } from "typeorm";
import { FeedbacksTheme } from "./feedbacks-theme.entity";
import { decodeHTML } from 'entities';

@Entity({ name: 'feedbacks' })
export class Feedback extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FeedbacksTheme)
    feedbacksTheme: FeedbacksTheme;

    @Column()
    feedbacksThemeId: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: 'Имя отправителя',
    })
    name: string;

    @Column({ type: 'char', length: 50, default: '0' })
    email: string;

    @Column({ type: 'char', length: 50, default: '0' })
    ip: string;

    @Column({ type: 'varchar', length: 1000, default: '0' })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @AfterLoad()
    decodeHTMLName() {
        this.name = this.name ? decodeHTML(this.name) : this.name;
        this.message = this.message ? decodeHTML(this.message) : this.message;
    }
}
