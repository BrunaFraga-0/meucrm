import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repo: Repository<Usuario>,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(email: string, senha: string): Promise<{ access_token: string }> {
        const usuario = await this.repo.findOne({ where: { email } });

        if (!usuario) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }   

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }   

        const accesso_token = await this.generateToken(usuario);

        return { access_token: accesso_token };
    }

    private async generateToken(usuario: Usuario): Promise<string> {
        const payload = { sub: usuario.id, email: usuario.email };

        return this.jwtService.signAsync(payload);
    }
}
