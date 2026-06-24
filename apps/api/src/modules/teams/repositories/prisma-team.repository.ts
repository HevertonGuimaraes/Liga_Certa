import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { ITeamRepository } from '../../../core/repositories';

@Injectable()
export class PrismaTeamRepository implements ITeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(championshipId?: string) {
    return this.prisma.team.findMany({
      where: { deletedAt: null, ...(championshipId ? { championshipId } : {}) },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.team.findFirst({
      where: { id, deletedAt: null },
      include: { players: { where: { deletedAt: null } }, coaches: { where: { deletedAt: null } } },
    });
  }

  async create(data: Record<string, unknown>) {
    return this.prisma.team.create({ data: data as never });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.team.update({ where: { id }, data: data as never });
  }

  async softDelete(id: string) {
    await this.prisma.team.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
