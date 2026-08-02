import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';

import { Cliente } from './cliente.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { WelcomeEmailProcessor } from './welcome-email.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    BullModule.registerQueue({
      name: 'welcome-email',
    }),
  ],
  controllers: [ClientesController],
  providers: [ClientesService, WelcomeEmailProcessor],
})
export class ClientesModule {}

