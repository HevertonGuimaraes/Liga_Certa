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
    return this.prisma.championship.create({ data: data as never });
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.championship.update({ where: { id }, data: data as never });
  }

  async softDelete(id: string) {
    await this.prisma.championship.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
