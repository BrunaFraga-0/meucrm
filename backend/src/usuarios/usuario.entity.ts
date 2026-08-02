import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn('uuid') 
    id!: string;

    @Column({ type: 'varchar', length: 100 }) 
    nome!: string;

    @Column({ unique: true, type: 'varchar', length: 255 }) 
    email!: string;

    @Column({ type: 'varchar', length: 255 }) 
    senha!: string;
}
