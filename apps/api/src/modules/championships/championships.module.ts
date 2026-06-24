import { Module } from '@nestjs/common';
import { ChampionshipsController } from './controllers/championships.controller';
import { PrismaChampionshipRepository } from './repositories/prisma-championship.repository';

@Module({
  controllers: [ChampionshipsController],
  providers: [PrismaChampionshipRepository],
  exports: [PrismaChampionshipRepository],
})
export class ChampionshipsModule {}
