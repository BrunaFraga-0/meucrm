import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('clientes')
export class Cliente {

    @PrimaryGeneratedColumn('uuid') 
    id!: string;

    @Column({ type: 'varchar', length: 100 }) 
    nome!: string;

    @Column({ unique: true, type: 'varchar', length: 255 }) 
    email!: string;

    @Column({ type: 'varchar', length: 20 }) 
    telefone!: string;

    @Column({ type: 'varchar', length: 100, nullable: true }) 
    empresa!: string | null;

    @Column({ type: 'text', nullable: true }) 
    observacoes!: string | null;

    @CreateDateColumn({ name: 'criado_em', type: 'timestamp', default: () => 'now()' }) 
    criadoEm!: Date;

}
