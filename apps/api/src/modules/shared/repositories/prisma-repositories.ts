import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { IPlayerRepository, ICoachRepository, IMatchRepository, IStandingRepository, IGoalRepository, IInviteLinkRepository } from '../../../core/repositories';

@Injectable()
export class PrismaPlayerRepository implements IPlayerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(teamId?: string) {
    return this.prisma.player.findMany({
      where: { deletedAt: null, ...(teamId ? { teamId } : {}) },
      orderBy: { number: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.player.findFirst({ where: { id, deletedAt: null } });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.player.create({ data: data as never });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.player.update({ where: { id }, data: data as never });
  }

  async softDelete(id: string) {
    await this.prisma.player.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

@Injectable()
export class PrismaCoachRepository implements ICoachRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(teamId?: string) {
    return this.prisma.coach.findMany({
      where: { deletedAt: null, ...(teamId ? { teamId } : {}) },
    });
  }

  async findById(id: string) {
    return this.prisma.coach.findFirst({ where: { id, deletedAt: null } });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.coach.create({ data: data as never });
  }

  async softDelete(id: string) {
    await this.prisma.coach.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

@Injectable()
export class PrismaMatchRepository implements IMatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: Record<string, unknown>) {
    return this.prisma.match.findMany({
      where: { deletedAt: null, ...filters },
      orderBy: { scheduledAt: 'asc' },
      include: { homeTeam: true, awayTeam: true },
    });
  }

  async findById(id: string) {
    return this.prisma.match.findFirst({
      where: { id, deletedAt: null },
      include: { homeTeam: true, awayTeam: true, goals: true },
    });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.match.create({ data: data as never });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.match.update({ where: { id }, data: data as never });
  }

  async softDelete(id: string) {
    await this.prisma.match.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

@Injectable()
export class PrismaStandingRepository implements IStandingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByChampionship(championshipId: string) {
    return this.prisma.standing.findMany({
      where: { championshipId, deletedAt: null },
      include: { team: true },
      orderBy: [{ points: 'desc' }, { goalsFor: 'desc' }],
    });
  }

  async upsert(data: Record<string, unknown>) {
    const { teamId, championshipId, ...rest } = data as { teamId: string; championshipId: string };
    return this.prisma.standing.upsert({
      where: { teamId_championshipId: { teamId, championshipId } },
      create: data as never,
      update: rest as never,
    });
  }

  async recalculate(championshipId: string) {
    // Placeholder — recálculo completo em partida finalizada
    void championshipId;
  }
}

@Injectable()
export class PrismaGoalRepository implements IGoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByMatch(matchId: string) {
    return this.prisma.goal.findMany({
      where: { matchId, deletedAt: null },
      include: { player: true },
    });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.goal.create({ data: data as never });
  }

  async getTopScorers(championshipId?: string) {
    const goals = await this.prisma.goal.groupBy({
      by: ['playerId'],
      where: { deletedAt: null },
      _count: { id: true },
    });

    const players = await Promise.all(
      goals.map(async (g) => {
        const player = await this.prisma.player.findUnique({
          where: { id: g.playerId },
          include: { team: true },
        });
        if (!player) return null;
        if (championshipId && player.team.championshipId !== championshipId) return null;
        return {
          playerId: player.id,
          playerName: player.name,
          teamName: player.team.name,
          goals: g._count.id,
        };
      }),
    );

    return players.filter(Boolean).sort((a, b) => (b?.goals ?? 0) - (a?.goals ?? 0));
  }
}

@Injectable()
export class PrismaInviteLinkRepository implements IInviteLinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string) {
    return this.prisma.inviteLink.findFirst({
      where: { slug, isActive: true, deletedAt: null },
      include: { championship: true, team: true },
    });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.inviteLink.create({ data: data as never });
  }
}
