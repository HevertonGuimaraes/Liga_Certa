import { Module } from '@nestjs/common';
import {
  PlayersController,
  CoachesController,
  MatchesController,
  StandingsController,
  GoalsController,
  StatisticsController,
  PublicController,
} from './controllers/resource-controllers';
import {
  PrismaPlayerRepository,
  PrismaCoachRepository,
  PrismaMatchRepository,
  PrismaStandingRepository,
  PrismaGoalRepository,
  PrismaInviteLinkRepository,
} from './repositories/prisma-repositories';

@Module({
  controllers: [
    PlayersController,
    CoachesController,
    MatchesController,
    StandingsController,
    GoalsController,
    StatisticsController,
    PublicController,
  ],
  providers: [
    PrismaPlayerRepository,
    PrismaCoachRepository,
    PrismaMatchRepository,
    PrismaStandingRepository,
    PrismaGoalRepository,
    PrismaInviteLinkRepository,
  ],
})
export class SharedModule {}
