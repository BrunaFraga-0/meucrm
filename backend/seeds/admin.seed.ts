import * as bcrypt from 'bcryptjs';
import { AppDataSource } from '../src/database/data-source';
import { Usuario } from '../src/usuarios/usuario.entity';

async function criarAdmin(): Promise<void> {
  try {
    await AppDataSource.initialize();

    const nome = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const senha = process.env.ADMIN_PASSWORD;

    if (!nome || !email || !senha) {
      throw new Error(
        'As variáveis ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD são obrigatórias.',
      );
    }

    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const adminExistente = await usuarioRepository.findOne({
      where: { email },
    });

    if (adminExistente) {
      console.log('Administrador já cadastrado.');
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const admin = usuarioRepository.create({
      nome,
      email,
      senha: senhaHash,
    });

    await usuarioRepository.save(admin);

    console.log('Administrador criado com sucesso.');
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

criarAdmin().catch((erro: unknown) => {
  console.error('Erro ao criar administrador:', erro);
  process.exitCode = 1;
});