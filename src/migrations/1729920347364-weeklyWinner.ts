import { MigrationInterface, QueryRunner } from 'typeorm';

export class WeeklyWinner1729920347364 implements MigrationInterface {
  name = 'WeeklyWinner1729920347364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "weekly_winner" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "week_start_date" datetime NOT NULL, "week_end_date" datetime NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_weekly_winner" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "week_start_date" datetime NOT NULL, "week_end_date" datetime NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" integer, CONSTRAINT "FK_96d2b82e91ed1479047c823cf65" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_weekly_winner"("id", "week_start_date", "week_end_date", "created_at", "user_id") SELECT "id", "week_start_date", "week_end_date", "created_at", "user_id" FROM "weekly_winner"`,
    );
    await queryRunner.query(`DROP TABLE "weekly_winner"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_weekly_winner" RENAME TO "weekly_winner"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "weekly_winner" RENAME TO "temporary_weekly_winner"`,
    );
    await queryRunner.query(
      `CREATE TABLE "weekly_winner" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "week_start_date" datetime NOT NULL, "week_end_date" datetime NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "user_id" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "weekly_winner"("id", "week_start_date", "week_end_date", "created_at", "user_id") SELECT "id", "week_start_date", "week_end_date", "created_at", "user_id" FROM "temporary_weekly_winner"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_weekly_winner"`);
    await queryRunner.query(`DROP TABLE "weekly_winner"`);
  }
}
