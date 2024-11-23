import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatId1732343697662 implements MigrationInterface {
  name = 'ChatId1732343697662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "result" ADD "chat_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "result" ADD CONSTRAINT "FK_2293abd415c6acaaffb603265c1" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "result" DROP CONSTRAINT "FK_2293abd415c6acaaffb603265c1"`,
    );
    await queryRunner.query(`ALTER TABLE "result" DROP COLUMN "chat_id"`);
  }
}
