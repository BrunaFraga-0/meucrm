import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuariosTable1785620017891 implements MigrationInterface {
    name = 'CreateUsuariosTable1785620017891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "usuarios" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "nome" character varying(100) NOT NULL, 
                "email" character varying(255) NOT NULL, 
                "senha" character varying(255) NOT NULL, 
                
                CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), 
                CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
