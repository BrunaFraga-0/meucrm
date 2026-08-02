import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,

    @InjectQueue('welcome-email') 
    private readonly filaDeBoasVindas: Queue,
    
  ) {}

  private async validarEmailDisponivel(email: string, idClienteAtualizar?: string): Promise<void> {
    const existente = await this.repo.findOne({ where: { email: email} });
    
    if (existente && existente.id !== idClienteAtualizar) throw new ConflictException('Já existe cliente com este e-mail');
  }

  async criar (criarDto: CreateClienteDto): Promise<Cliente> {
    await this.validarEmailDisponivel(criarDto.email);

    const cliente = await this.repo.save(criarDto);
    await this.filaDeBoasVindas.add('send-welcome', { email: cliente.email, nome: cliente.nome }); 

    return cliente;
  }

  async listar(busca?: string): Promise<Cliente[]>{
    const termo = busca?.trim();

    if(!termo) {
     return await this.repo.find();
    }

    return await this.repo.find({
      where: {
        nome: ILike(`%${termo}%`),
      }
    })
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