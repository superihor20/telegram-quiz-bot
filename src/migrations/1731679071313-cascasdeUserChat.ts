import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascasdeUserChat1731679071313 implements MigrationInterface {
  name = 'CascasdeUserChat1731679071313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat" ADD CONSTRAINT "UQ_415c34dcb5ad6193a9ea9dab25e" UNIQUE ("chat_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat" DROP CONSTRAINT "UQ_415c34dcb5ad6193a9ea9dab25e"`,
    );
  }
}
