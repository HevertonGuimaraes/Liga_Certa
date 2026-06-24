import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { IUserRepository } from '../../core/repositories';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id, deletedAt: null } }) as Promise<User | null>;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email, deletedAt: null } }) as Promise<User | null>;
  }

  async create(data: { name: string; email: string; passwordHash: string; role?: UserRole }): Promise<User> {
    return this.prisma.user.create({ data }) as Promise<User>;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data }) as Promise<User>;
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
