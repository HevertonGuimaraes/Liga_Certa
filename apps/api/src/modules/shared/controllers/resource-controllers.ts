import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PrismaPlayerRepository,
  PrismaCoachRepository,
  PrismaMatchRepository,
  PrismaGoalRepository,
} from '../repositories/prisma-repositories';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { IsString, MinLength, MaxLength, IsUUID, IsInt, Min, Max } from 'class-validator';

class CreatePlayerDto {
  @IsString() @MinLength(2) name!: string;
  @IsInt() @Min(1) @Max(99) number!: number;
  @IsString() @MinLength(2) @MaxLength(50) position!: string;
  @IsUUID() teamId!: string;
}

class CreateCoachDto {
  @IsString() @MinLength(2) name!: string;
  @IsUUID() teamId!: string;
}

type StandingWithTeam = Prisma.StandingGetPayload<{ include: { team: true } }>;

@Controller('players')
@UseGuards(AuthGuard('jwt'))
export class PlayersController {
  constructor(private readonly repo: PrismaPlayerRepository) {}

  @Get()
  findAll() {
    return this.repo.findAll();
  }

  @Post()
  create(@Body() dto: CreatePlayerDto) {
    return this.repo.create({ ...dto });
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

  @Post()
  create(@Body() dto: CreateCoachDto) {
    return this.repo.create({ ...dto });
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
    return standings.map((s: StandingWithTeam) => ({
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

  @Get('championships')
  async searchChampionships(@Query('q') q?: string) {
    const search = q?.trim();
    return this.prisma.championship.findMany({
      where: {
        deletedAt: null,
        ...(search ? { name: { contains: search } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: search ? 20 : 6,
      select: {
        id: true,
        name: true,
        season: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });
  }

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
