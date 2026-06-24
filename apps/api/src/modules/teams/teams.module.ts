import { Module } from '@nestjs/common';
import { TeamsController } from './controllers/teams.controller';
import { PrismaTeamRepository } from './repositories/prisma-team.repository';

@Module({
  controllers: [TeamsController],
  providers: [PrismaTeamRepository],
})
export class TeamsModule {}
