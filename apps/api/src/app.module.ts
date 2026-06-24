import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChampionshipsModule } from './modules/championships/championships.module';
import { TeamsModule } from './modules/teams/teams.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ChampionshipsModule,
    TeamsModule,
    SharedModule,
  ],
})
export class AppModule {}
