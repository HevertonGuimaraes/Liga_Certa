import { User, UserRole } from '../../modules/users/entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: { name: string; email: string; passwordHash: string; role?: UserRole }): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  softDelete(id: string): Promise<void>;
}

export interface IChampionshipRepository {
  findAll(ownerId?: string): Promise<unknown[]>;
  findById(id: string): Promise<unknown | null>;
  create(data: Record<string, unknown>): Promise<unknown>;
  update(id: string, data: Record<string, unknown>): Promise<unknown>;
  softDelete(id: string): Promise<void>;
}

export interface ITeamRepository {
  findAll(championshipId?: string): Promise<unknown[]>;
  findById(id: string): Promise<unknown | null>;
  create(data: Record<string, unknown>): Promise<unknown>;
  update(id: string, data: Record<string, unknown>): Promise<unknown>;
  softDelete(id: string): Promise<void>;
}

export interface IPlayerRepository {
  findAll(teamId?: string): Promise<unknown[]>;
  findById(id: string): Promise<unknown | null>;
  create(data: Record<string, unknown>): Promise<unknown>;
  update(id: string, data: Record<string, unknown>): Promise<unknown>;
  softDelete(id: string): Promise<void>;
}

export interface ICoachRepository {
  findAll(teamId?: string): Promise<unknown[]>;
  findById(id: string): Promise<unknown | null>;
  create(data: Record<string, unknown>): Promise<unknown>;
  softDelete(id: string): Promise<void>;
}

export interface IMatchRepository {
  findAll(filters?: Record<string, unknown>): Promise<unknown[]>;
  findById(id: string): Promise<unknown | null>;
  create(data: Record<string, unknown>): Promise<unknown>;
  update(id: string, data: Record<string, unknown>): Promise<unknown>;
  softDelete(id: string): Promise<void>;
}

export interface IStandingRepository {
  findByChampionship(championshipId: string): Promise<unknown[]>;
  upsert(data: Record<string, unknown>): Promise<unknown>;
  recalculate(championshipId: string): Promise<void>;
}

export interface IGoalRepository {
  findByMatch(matchId: string): Promise<unknown[]>;
  create(data: Record<string, unknown>): Promise<unknown>;
  getTopScorers(championshipId?: string): Promise<unknown[]>;
}

export interface IInviteLinkRepository {
  findBySlug(slug: string): Promise<unknown | null>;
  create(data: Record<string, unknown>): Promise<unknown>;
}

export interface ISettingsRepository {
  findByUserId(userId: string): Promise<unknown | null>;
  upsert(userId: string, data: Record<string, unknown>): Promise<unknown>;
}
