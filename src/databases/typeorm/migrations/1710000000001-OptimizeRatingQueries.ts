import { MigrationInterface, QueryRunner } from "typeorm";

export class OptimizeRatingQueries1710000000001 implements MigrationInterface {
    name = 'OptimizeRatingQueries1710000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Optimize review_books table for rating queries
        await queryRunner.query(`
            CREATE INDEX idx_review_books_rating 
            ON review_books (rating)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_review_books_book_id_rating 
            ON review_books (bookId, rating)
        `);

        // Optimize reviews_audiobooks table for rating queries
        await queryRunner.query(`
            CREATE INDEX idx_reviews_audiobooks_rating 
            ON reviews_audiobooks (rating)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_reviews_audiobooks_audiobooks_id_rating 
            ON reviews_audiobooks (audiobooksId, rating)
        `);

        // Composite indexes for books with rating queries
        await queryRunner.query(`
            CREATE INDEX idx_books_published_deleted_rating 
            ON books (published, deletedAt, id)
        `);

        // Composite indexes for audiobooks with rating queries
        await queryRunner.query(`
            CREATE INDEX idx_audiobooks_published_rating 
            ON audiobooks (published, id)
        `);

        // Indexes for author name queries in rating context
        await queryRunner.query(`
            CREATE INDEX idx_authors_name_uz_rating 
            ON authors (name_uz, lastName_uz)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_authors_name_ru_rating 
            ON authors (name_ru, lastName_ru)
        `);

        await queryRunner.query(`
            CREATE INDEX idx_authors_name_en_rating 
            ON authors (name_en, lastName_en)
        `);

        // Indexes for book-authors relationship in rating context
        await queryRunner.query(`
            CREATE INDEX idx_books_authors_book_id_rating 
            ON books_authors_authors (bookId, authorId)
        `);

        // Indexes for audiobook-authors relationship in rating context
        await queryRunner.query(`
            CREATE INDEX idx_audiobooks_authors_audiobook_id_rating 
            ON audiobooks_authors_authors (audiobookId, authorId)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all created indexes
        await queryRunner.query(`DROP INDEX idx_review_books_rating ON review_books`);
        await queryRunner.query(`DROP INDEX idx_review_books_book_id_rating ON review_books`);
        await queryRunner.query(`DROP INDEX idx_reviews_audiobooks_rating ON reviews_audiobooks`);
        await queryRunner.query(`DROP INDEX idx_reviews_audiobooks_audiobooks_id_rating ON reviews_audiobooks`);
        await queryRunner.query(`DROP INDEX idx_books_published_deleted_rating ON books`);
        await queryRunner.query(`DROP INDEX idx_audiobooks_published_rating ON audiobooks`);
        await queryRunner.query(`DROP INDEX idx_authors_name_uz_rating ON authors`);
        await queryRunner.query(`DROP INDEX idx_authors_name_ru_rating ON authors`);
        await queryRunner.query(`DROP INDEX idx_authors_name_en_rating ON authors`);
        await queryRunner.query(`DROP INDEX idx_books_authors_book_id_rating ON books_authors_authors`);
        await queryRunner.query(`DROP INDEX idx_audiobooks_authors_audiobook_id_rating ON audiobooks_authors_authors`);
    }
}

