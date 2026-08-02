import { Controller, Get, Post, Body, Param, Delete, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clientes')
@UseGuards(JwtAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}



  @Post()
  criar(@Body() criarDto: CreateClienteDto) {
    return this.clientesService.criar(criarDto);
  }

  @Get() 
  listar(@Query('busca') busca?: string) { 
    return this.clientesService.listar(busca); 
  } 
 
  @Get(':id')
  buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.clientesService.buscarPorId(id);
  }

  @Put(':id')
  atualizar(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.atualizar(id, updateClienteDto);
  }

  @Delete(':id')
  deletar(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.clientesService.deletar(id);
  }
}