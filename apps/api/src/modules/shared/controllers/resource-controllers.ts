import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PrismaPlayerRepository,
  PrismaCoachRepository,
  PrismaMatchRepository,
  PrismaGoalRepository,
  PrismaStandingRepository,
} from '../repositories/prisma-repositories';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import {
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { MatchStatus } from '@prisma/client';

class CreatePlayerDto {
  @IsString() @MinLength(2) name!: string;
  @IsInt() @Min(1) @Max(99) number!: number;
  @IsString() @MinLength(2) @MaxLength(50) position!: string;
  @IsUUID() teamId!: string;
}

class UpdatePlayerDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsInt() @Min(1) @Max(99) number?: number;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(50) position?: string;
  @IsOptional() @IsUUID() teamId?: string;
}

class CreateCoachDto {
  @IsString() @MinLength(2) name!: string;
  @IsUUID() teamId!: string;
}

class UpdateCoachDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsUUID() teamId?: string;
}

class CreateMatchDto {
  @IsUUID() homeTeamId!: string;
  @IsUUID() awayTeamId!: string;
  @IsUUID() championshipId!: string;
  @IsDateString() scheduledAt!: string;
  @IsOptional() @IsInt() @Min(0) homeScore?: number;
  @IsOptional() @IsInt() @Min(0) awayScore?: number;
  @IsOptional() @IsEnum(MatchStatus) status?: MatchStatus;
  @IsOptional() @IsInt() @Min(1) roundNumber?: number;
}

class UpdateMatchDto {
  @IsOptional() @IsUUID() homeTeamId?: string;
  @IsOptional() @IsUUID() awayTeamId?: string;
  @IsOptional() @IsDateString() scheduledAt?: string;
  @IsOptional() @IsInt() @Min(0) homeScore?: number;
  @IsOptional() @IsInt() @Min(0) awayScore?: number;
  @IsOptional() @IsEnum(MatchStatus) status?: MatchStatus;
}

class CreateStandingDto {
  @IsUUID() teamId!: string;
  @IsUUID() championshipId!: string;
  @IsOptional() @IsInt() @Min(0) played?: number;
  @IsOptional() @IsInt() @Min(0) wins?: number;
  @IsOptional() @IsInt() @Min(0) draws?: number;
  @IsOptional() @IsInt() @Min(0) losses?: number;
  @IsOptional() @IsInt() @Min(0) goalsFor?: number;
  @IsOptional() @IsInt() @Min(0) goalsAgainst?: number;
  @IsOptional() @IsInt() @Min(0) points?: number;
}

class UpdateStandingDto {
  @IsOptional() @IsInt() @Min(0) played?: number;
  @IsOptional() @IsInt() @Min(0) wins?: number;
  @IsOptional() @IsInt() @Min(0) draws?: number;
  @IsOptional() @IsInt() @Min(0) losses?: number;
  @IsOptional() @IsInt() @Min(0) goalsFor?: number;
  @IsOptional() @IsInt() @Min(0) goalsAgainst?: number;
  @IsOptional() @IsInt() @Min(0) points?: number;
}

class CreateGoalDto {
  @IsInt() @Min(1) @Max(120) minute!: number;
  @IsUUID() playerId!: string;
  @IsUUID() matchId!: string;
}

class UpdateGoalDto {
  @IsOptional() @IsInt() @Min(1) @Max(120) minute?: number;
  @IsOptional() @IsUUID() playerId?: string;
  @IsOptional() @IsUUID() matchId?: string;
}

type StandingWithTeam = Prisma.StandingGetPayload<{ include: { team: true } }>;

function mapStanding(s: StandingWithTeam) {
  return {
    id: s.id,
    teamId: s.teamId,
    championshipId: s.championshipId,
    teamName: s.team.name,
    played: s.played,
    wins: s.wins,
    draws: s.draws,
    losses: s.losses,
    goalsFor: s.goalsFor,
    goalsAgainst: s.goalsAgainst,
    points: s.points,
  };
}

function slugify(name: string, id: string) {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}-${id.slice(0, 8)}`;
}

@Controller('players')
@UseGuards(AuthGuard('jwt'))
export class PlayersController {
  constructor(private readonly repo: PrismaPlayerRepository) {}

  @Get()
  findAll(@Query('teamId') teamId?: string) {
    return this.repo.findAll(teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findById(id);
  }

  @Post()
  create(@Body() dto: CreatePlayerDto) {
    return this.repo.create({ ...dto });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlayerDto) {
    return this.repo.update(id, { ...dto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repo.softDelete(id);
    return { message: 'Atleta excluído' };
  }
}

@Controller('coaches')
@UseGuards(AuthGuard('jwt'))
export class CoachesController {
  constructor(private readonly repo: PrismaCoachRepository) {}

  @Get()
  findAll(@Query('teamId') teamId?: string) {
    return this.repo.findAll(teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findById(id);
  }

  @Post()
  create(@Body() dto: CreateCoachDto) {
    return this.repo.create({ ...dto });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCoachDto) {
    return this.repo.update(id, { ...dto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repo.softDelete(id);
    return { message: 'Técnico excluído' };
  }
}

@Controller('matches')
@UseGuards(AuthGuard('jwt'))
export class MatchesController {
  constructor(
    private readonly repo: PrismaMatchRepository,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  findAll() {
    return this.repo.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateMatchDto) {
    const roundNumber = dto.roundNumber ?? 1;
    let round = await this.prisma.round.findFirst({
      where: { championshipId: dto.championshipId, number: roundNumber, deletedAt: null },
    });
    if (!round) {
      round = await this.prisma.round.create({
        data: {
          championshipId: dto.championshipId,
          number: roundNumber,
          name: `Rodada ${roundNumber}`,
        },
      });
    }
    return this.repo.create({
      homeTeamId: dto.homeTeamId,
      awayTeamId: dto.awayTeamId,
      scheduledAt: dto.scheduledAt,
      homeScore: dto.homeScore ?? null,
      awayScore: dto.awayScore ?? null,
      status: dto.status ?? 'SCHEDULED',
      roundId: round.id,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMatchDto) {
    return this.repo.update(id, { ...dto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repo.softDelete(id);
    return { message: 'Partida excluída' };
  }
}

@Controller('standings')
@UseGuards(AuthGuard('jwt'))
export class StandingsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: PrismaStandingRepository,
  ) {}

  @Get()
  async findAll(@Query('championshipId') championshipId?: string) {
    const standings = championshipId
      ? await this.repo.findByChampionship(championshipId)
      : await this.prisma.standing.findMany({
          where: { deletedAt: null },
          include: { team: true },
          orderBy: [{ points: 'desc' }, { goalsFor: 'desc' }],
        });
    return standings.map((s: StandingWithTeam) => mapStanding(s));
  }

  @Post()
  async create(@Body() dto: CreateStandingDto) {
    const standing = await this.repo.upsert({
      teamId: dto.teamId,
      championshipId: dto.championshipId,
      played: dto.played ?? 0,
      wins: dto.wins ?? 0,
      draws: dto.draws ?? 0,
      losses: dto.losses ?? 0,
      goalsFor: dto.goalsFor ?? 0,
      goalsAgainst: dto.goalsAgainst ?? 0,
      points: dto.points ?? 0,
    });
    const full = await this.prisma.standing.findUnique({
      where: { id: standing.id },
      include: { team: true },
    });
    return mapStanding(full as StandingWithTeam);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStandingDto) {
    const standing = await this.repo.update(id, { ...dto });
    const full = await this.prisma.standing.findUnique({
      where: { id: standing.id },
      include: { team: true },
    });
    return mapStanding(full as StandingWithTeam);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repo.softDelete(id);
    return { message: 'Classificação excluída' };
  }
}

@Controller('goals')
@UseGuards(AuthGuard('jwt'))
export class GoalsController {
  constructor(private readonly repo: PrismaGoalRepository) {}

  @Get()
  findAll() {
    return this.repo.findAll();
  }

  @Post()
  create(@Body() dto: CreateGoalDto) {
    return this.repo.create({ ...dto });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.repo.update(id, { ...dto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repo.softDelete(id);
    return { message: 'Gol excluído' };
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

  private async ensureInviteLink(championshipId: string, name: string) {
    const existing = await this.prisma.inviteLink.findFirst({
      where: { championshipId, isActive: true, deletedAt: null },
    });
    if (existing) return existing.slug;
    const slug = slugify(name, championshipId);
    await this.prisma.inviteLink.create({
      data: { slug, type: 'CHAMPIONSHIP', championshipId },
    });
    return slug;
  }

  @Get('championships')
  async searchChampionships(@Query('q') q?: string) {
    const search = q?.trim();
    const rows = await this.prisma.championship.findMany({
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
        inviteLinks: {
          where: { isActive: true, deletedAt: null },
          take: 1,
          select: { slug: true },
        },
      },
    });

    return Promise.all(
      rows.map(async (row) => {
        let slug = row.inviteLinks[0]?.slug;
        if (!slug) slug = await this.ensureInviteLink(row.id, row.name);
        return {
          id: row.id,
          name: row.name,
          season: row.season,
          status: row.status,
          startDate: row.startDate,
          endDate: row.endDate,
          slug,
        };
      }),
    );
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
