import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'O campo "e-mail" é obrigatório.' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email!: string;

  @IsNotEmpty({ message: 'O campo "senha" é obrigatório.' })
  @IsString({ message: 'A senha deve ser um texto.' })
  senha!: string;
}