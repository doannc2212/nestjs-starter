import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1742557235367 implements MigrationInterface {
  name = 'Initial1742557235367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "order" (
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "address" character varying NOT NULL,
        CONSTRAINT "PK_order_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "order_item" (
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "orderId" uuid NOT NULL,
        "itemId" character varying NOT NULL,
        "quantity" integer NOT NULL,
        CONSTRAINT "UQ_order_item_order_id_item_id" UNIQUE ("orderId", "itemId"),
        CONSTRAINT "PK_order_item_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "order_item" 
      ADD CONSTRAINT "FK_order_item_order_id" 
      FOREIGN KEY ("orderId") 
      REFERENCES "order"("id") 
      ON DELETE NO ACTION 
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_order_id"`,
    );
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
