import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

interface DadosBoasVindas {
  nome: string;
  email: string;
}

@Processor('welcome-email')
export class WelcomeEmailProcessor extends WorkerHost {
  async process(job: Job<DadosBoasVindas>): Promise<void> {
    console.log(`Enviando boas-vindas para ${job.data.nome} <${job.data.email}>`);
  }
}