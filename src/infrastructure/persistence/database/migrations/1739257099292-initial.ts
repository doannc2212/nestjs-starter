import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1739257099292 implements MigrationInterface {
  name = 'Initial1739257099292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "note" (
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
    
        CONSTRAINT "UK_NOTE_NAME" UNIQUE ("name"),
        CONSTRAINT "PK_NOTE_ID" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "note"`);
  }
}
