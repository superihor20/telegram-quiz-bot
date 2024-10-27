import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1729612762379 implements MigrationInterface {
  name = 'Init1729612762379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "question" varchar NOT NULL, "explanation" varchar, "code" varchar, "is_published" boolean NOT NULL DEFAULT (0), "poll_id" varchar, "last_updated" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "answer" varchar NOT NULL, "is_correct" boolean NOT NULL, "last_updated" datetime NOT NULL DEFAULT (datetime('now')), "question_id" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "telegram_id" varchar NOT NULL, "username" varchar, "name" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "result" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "is_correct" boolean NOT NULL, "user_id" integer, "question_id" integer, "answer_id" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_answer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "answer" varchar NOT NULL, "is_correct" boolean NOT NULL, "last_updated" datetime NOT NULL DEFAULT (datetime('now')), "question_id" integer, CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_answer"("id", "answer", "is_correct", "last_updated", "question_id") SELECT "id", "answer", "is_correct", "last_updated", "question_id" FROM "answer"`,
    );
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_answer" RENAME TO "answer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_result" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "is_correct" boolean NOT NULL, "user_id" integer, "question_id" integer, "answer_id" integer, CONSTRAINT "FK_5c7ea952ae3947255abac7cef57" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a2ba149444801836e7a57d1c90f" FOREIGN KEY ("question_id") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0d39e64fbe72d684d805fe1a660" FOREIGN KEY ("answer_id") REFERENCES "answer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_result"("id", "is_correct", "user_id", "question_id", "answer_id") SELECT "id", "is_correct", "user_id", "question_id", "answer_id" FROM "result"`,
    );
    await queryRunner.query(`DROP TABLE "result"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_result" RENAME TO "result"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "result" RENAME TO "temporary_result"`,
    );
    await queryRunner.query(
      `CREATE TABLE "result" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "is_correct" boolean NOT NULL, "user_id" integer, "question_id" integer, "answer_id" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "result"("id", "is_correct", "user_id", "question_id", "answer_id") SELECT "id", "is_correct", "user_id", "question_id", "answer_id" FROM "temporary_result"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_result"`);
    await queryRunner.query(
      `ALTER TABLE "answer" RENAME TO "temporary_answer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "answer" varchar NOT NULL, "is_correct" boolean NOT NULL, "last_updated" datetime NOT NULL DEFAULT (datetime('now')), "question_id" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "answer"("id", "answer", "is_correct", "last_updated", "question_id") SELECT "id", "answer", "is_correct", "last_updated", "question_id" FROM "temporary_answer"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_answer"`);
    await queryRunner.query(`DROP TABLE "result"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP TABLE "question"`);
  }
}
