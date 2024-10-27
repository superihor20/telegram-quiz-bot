import { MigrationInterface, QueryRunner } from 'typeorm';

export class Streak1730012672270 implements MigrationInterface {
  name = 'Streak1730012672270';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "telegram_id" varchar NOT NULL, "username" varchar, "name" varchar NOT NULL, "streak" integer NOT NULL DEFAULT (0))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "telegram_id", "username", "name") SELECT "id", "telegram_id", "username", "name" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "telegram_id" varchar NOT NULL, "username" varchar, "name" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "telegram_id", "username", "name") SELECT "id", "telegram_id", "username", "name" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
  }
}
