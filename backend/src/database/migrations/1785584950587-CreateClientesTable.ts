import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientesTable1785584950587 implements MigrationInterface {
  name = 'CreateClientesTable1785584950587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "clientes" (
              "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
              "nome" character varying(100) NOT NULL, 
              "email" character varying(255) NOT NULL, 
              "telefone" character varying(20) NOT NULL, 
              "empresa" character varying(100), 
              "observacoes" text, 
              "criado_em" TIMESTAMP NOT NULL DEFAULT now(), 

              CONSTRAINT "UQ_3cd5652ab34ca1a0a2c7a255313" UNIQUE ("email"), 
              CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id")
              )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "clientes"`);
  }
}
