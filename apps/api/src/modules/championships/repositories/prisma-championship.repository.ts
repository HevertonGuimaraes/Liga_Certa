import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { IChampionshipRepository } from '../../../core/repositories';

@Injectable()
export class PrismaChampionshipRepository implements IChampionshipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId?: string) {
    return this.prisma.championship.findMany({
      where: { deletedAt: null, ...(ownerId ? { ownerId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.championship.findFirst({ where: { id, deletedAt: null } });
  }

  async create(data: Record<string, unknown>) {
    const championship = await this.prisma.championship.create({ data: data as never });
    const baseSlug = String(data.name ?? 'campeonato')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${championship.id.slice(0, 8)}`;
    await this.prisma.inviteLink.create({
      data: {
        slug,
        type: 'CHAMPIONSHIP',
        championshipId: championship.id,
      },
    });
    return championship;
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.championship.update({ where: { id }, data: data as never });
  }

  async softDelete(id: string) {
    await this.prisma.championship.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
