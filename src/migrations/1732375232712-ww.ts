import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ww1732375232712 implements MigrationInterface {
  name = 'Ww1732375232712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "weekly_winner" ADD "chat_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "weekly_winner" ADD CONSTRAINT "FK_47ab243b8d49813a91b8295e507" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "weekly_winner" DROP CONSTRAINT "FK_47ab243b8d49813a91b8295e507"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weekly_winner" DROP COLUMN "chat_id"`,
    );
  }
}
