import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ConflictException, Injectable, NotFoundException, Query } from '@nestjs/common';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    //@InjectQueue('welcome-email') private welcomeQueue: Queue, 
    private readonly repo: Repository<Cliente>,
  ) {}

  private async validarEmailDisponivel(email: string, idClienteAtualizar?: string): Promise<void> {
    const existente = await this.repo.findOne({ where: { email: email} });
    if (existente && existente.id !== idClienteAtualizar) throw new ConflictException('Já existe cliente com este e-mail');
  }

  async criar (criarDto: CreateClienteDto): Promise<Cliente> {
    await this.validarEmailDisponivel(criarDto.email);

    const cliente = await this.repo.save(criarDto);
    //await this.welcomeQueue.add('send-welcome', { email: cliente.email, nome: cliente.nome }); 
    return cliente;
  }

  async listar(@Query('busca') busca?: string): Promise<Cliente[]>{
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