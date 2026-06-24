import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PrismaPlayerRepository,
  PrismaCoachRepository,
  PrismaMatchRepository,
  PrismaGoalRepository,
} from '../repositories/prisma-repositories';
import { PrismaService } from '../../../infra/prisma/prisma.service';

@Controller('players')
@UseGuards(AuthGuard('jwt'))
export class PlayersController {
  constructor(private readonly repo: PrismaPlayerRepository) {}

  @Get()
  findAll() {
    return this.repo.findAll();
  }
}

@Controller('coaches')
@UseGuards(AuthGuard('jwt'))
export class CoachesController {
  constructor(private readonly repo: PrismaCoachRepository) {}

  @Get()
  findAll() {
    return this.repo.findAll();
  }
}

@Controller('matches')
@UseGuards(AuthGuard('jwt'))
export class MatchesController {
  constructor(private readonly repo: PrismaMatchRepository) {}

  @Get()
  findAll() {
    return this.repo.findAll();
  }
}

@Controller('standings')
@UseGuards(AuthGuard('jwt'))
export class StandingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    const standings = await this.prisma.standing.findMany({
      where: { deletedAt: null },
      include: { team: true },
      orderBy: [{ points: 'desc' }, { goalsFor: 'desc' }],
    });
    return standings.map((s) => ({
      id: s.id,
      teamId: s.teamId,
      teamName: s.team.name,
      played: s.played,
      wins: s.wins,
      draws: s.draws,
      losses: s.losses,
      goalsFor: s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      points: s.points,
    }));
  }
}

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly goals: PrismaGoalRepository,
  ) {}

  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'))
  async dashboard() {
    const [championships, teams, matches, goals] = await Promise.all([
      this.prisma.championship.count({ where: { deletedAt: null } }),
      this.prisma.team.count({ where: { deletedAt: null } }),
      this.prisma.match.count({ where: { deletedAt: null } }),
      this.prisma.goal.count({ where: { deletedAt: null } }),
    ]);
    return { championships, teams, matches, goals };
  }

  @Get('top-scorers')
  @UseGuards(AuthGuard('jwt'))
  topScorers() {
    return this.goals.getTopScorers();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async summary() {
    const [totalPlayers, totalCoaches, finishedMatches] = await Promise.all([
      this.prisma.player.count({ where: { deletedAt: null } }),
      this.prisma.coach.count({ where: { deletedAt: null } }),
      this.prisma.match.count({ where: { deletedAt: null, status: 'FINISHED' } }),
    ]);
    return { totalPlayers, totalCoaches, finishedMatches };
  }
}

@Controller('public')
export class PublicController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const link = await this.prisma.inviteLink.findFirst({
      where: { slug, isActive: true, deletedAt: null },
      include: {
        championship: { include: { standings: { include: { team: true } } } },
        team: true,
      },
    });
    if (!link) return null;
    return {
      title: link.championship?.name ?? link.team?.name,
      type: link.type,
      standings: link.championship?.standings,
    };
  }
}
