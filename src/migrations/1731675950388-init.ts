import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1731675950388 implements MigrationInterface {
  name = 'Init1731675950388';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "weekly_winner" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_53c75f1566638b4cf5a173be4c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "telegram_id" character varying NOT NULL, "username" character varying, "name" character varying NOT NULL, "streak" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat" ("id" SERIAL NOT NULL, "chat_id" bigint NOT NULL, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_chat" ("id" SERIAL NOT NULL, "message_id" integer NOT NULL, "poll_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "question_id" integer, "chat_id" integer, CONSTRAINT "PK_551a8aa85c04c194056e17f7960" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."question_type_enum" AS ENUM('HARD', 'EASY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "explanation" character varying, "code" character varying, "type" "public"."question_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" SERIAL NOT NULL, "answer" character varying NOT NULL, "is_correct" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "question_id" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "result" ("id" SERIAL NOT NULL, "is_correct" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "question_id" integer, "answer_id" integer, CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_chat" ("user_id" integer NOT NULL, "chat_id" integer NOT NULL, CONSTRAINT "PK_1a0006be82337a8768d40250893" PRIMARY KEY ("user_id", "chat_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7633fe1395d0705b301a21cf4d" ON "user_chat" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5366da78c4f08914a33f6e23d5" ON "user_chat" ("chat_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "weekly_winner" ADD CONSTRAINT "FK_96d2b82e91ed1479047c823cf65" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_chat" ADD CONSTRAINT "FK_c4c69b8dd259d84377f30b45455" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_chat" ADD CONSTRAINT "FK_bc57c1d089cc64cf7c8e1f48039" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD CONSTRAINT "FK_5c7ea952ae3947255abac7cef57" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD CONSTRAINT "FK_a2ba149444801836e7a57d1c90f" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" ADD CONSTRAINT "FK_0d39e64fbe72d684d805fe1a660" FOREIGN KEY ("answer_id") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chat" ADD CONSTRAINT "FK_7633fe1395d0705b301a21cf4d3" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chat" ADD CONSTRAINT "FK_5366da78c4f08914a33f6e23d51" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_chat" DROP CONSTRAINT "FK_5366da78c4f08914a33f6e23d51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_chat" DROP CONSTRAINT "FK_7633fe1395d0705b301a21cf4d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" DROP CONSTRAINT "FK_0d39e64fbe72d684d805fe1a660"`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" DROP CONSTRAINT "FK_a2ba149444801836e7a57d1c90f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "result" DROP CONSTRAINT "FK_5c7ea952ae3947255abac7cef57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_chat" DROP CONSTRAINT "FK_bc57c1d089cc64cf7c8e1f48039"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_chat" DROP CONSTRAINT "FK_c4c69b8dd259d84377f30b45455"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weekly_winner" DROP CONSTRAINT "FK_96d2b82e91ed1479047c823cf65"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5366da78c4f08914a33f6e23d5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7633fe1395d0705b301a21cf4d"`,
    );
    await queryRunner.query(`DROP TABLE "user_chat"`);
    await queryRunner.query(`DROP TABLE "result"`);
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TYPE "public"."question_type_enum"`);
    await queryRunner.query(`DROP TABLE "question_chat"`);
    await queryRunner.query(`DROP TABLE "chat"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "weekly_winner"`);
  }
}
