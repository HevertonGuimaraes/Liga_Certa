export type UserRole = 'ADMIN' | 'ORGANIZER' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Championship {
  id: string;
  name: string;
  season: string;
  bannerUrl?: string;
  status: 'DRAFT' | 'ACTIVE' | 'FINISHED';
  startDate?: string;
  endDate?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  shieldUrl?: string;
  championshipId: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  photoUrl?: string;
  teamId: string;
}

export interface Coach {
  id: string;
  name: string;
  teamId: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  scheduledAt: string;
  roundId: string;
}

export interface Standing {
  id: string;
  teamId: string;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
