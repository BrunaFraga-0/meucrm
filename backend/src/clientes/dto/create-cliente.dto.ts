import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateClienteDto {
  @IsNotEmpty({ message: 'O campo "nome" é obrigatório.' })
  @IsString()
  @MaxLength(100)
  nome!: string;

  @IsNotEmpty({ message: 'O campo "e-mail" é obrigatório' })
  @IsString()
  @IsEmail({}, { message: 'E-mail inválido.' })
  @MaxLength(255)
  email!: string;

  @IsNotEmpty({ message: 'O campo "telefone" é obrigatório' })
  @IsString()
  @MaxLength(20)
  @Matches(/^\([1-9]{2}\)\ 9[0-9]{4}-[0-9]{4}$/, {message: 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX.'})
  telefone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  empresa?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
