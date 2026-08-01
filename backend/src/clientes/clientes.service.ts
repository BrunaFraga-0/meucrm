import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,
  ) {}

  private async validarEmailDisponivel(email: string, idClienteAtualizar?: string): Promise<void> {
    const existente = await this.repo.findOne({ where: { email: email} });
    if (existente && existente.id !== idClienteAtualizar) throw new ConflictException('Já existe cliente com este e-mail');
  }

  async criar (criarDto: CreateClienteDto): Promise<Cliente> {
    await this.validarEmailDisponivel(criarDto.email);

    return await this.repo.save(criarDto);
  }

  async listar(): Promise<Cliente[]>{
    const lista = await this.repo.find();
    return lista;
  }

  async buscarPorId(id: string): Promise<Cliente> {
    const cliente = await this.repo.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  async atualizar(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.buscarPorId(id);
    
    if (updateClienteDto.email) {
      await this.validarEmailDisponivel(updateClienteDto.email, id);
    }

    Object.assign(cliente, updateClienteDto);
    return await this.repo.save(cliente);
  }

  async deletar(id: string): Promise<Cliente> {
    const cliente = await this.buscarPorId(id);

    return await this.repo.remove(cliente);
  }
}

/*
@Injectable() 
export class ClientesService { 
 constructor( 
 @InjectRepository(Cliente) private repo: Repository<Cliente>, 
 @InjectQueue('welcome-email') private welcomeQueue: Queue, 
 ) {} 
 
 async criar(dto: CriarClienteDto) { 
 const existente = await this.repo.findOne({ where: { email: dto.email } }); 
 if (existente) throw new ConflictException('Já existe cliente com este 
email'); 
 
 const cliente = await this.repo.save(dto); 
 await this.welcomeQueue.add('send-welcome', { email: cliente.email, nome: 
cliente.nome }); 
 return cliente; 
 } 
} 
*/