import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaChampionshipRepository } from '../repositories/prisma-championship.repository';
import { IsString, MinLength, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ChampionshipStatus } from '@prisma/client';

class CreateChampionshipDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() season!: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}

class UpdateChampionshipDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsString() season?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsEnum(ChampionshipStatus) status?: ChampionshipStatus;
}

@Controller('championships')
@UseGuards(AuthGuard('jwt'))
export class ChampionshipsController {
  constructor(private readonly repo: PrismaChampionshipRepository) {}

  @Get()
  findAll(@Request() req: { user: { userId: string } }) {
    return this.repo.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findById(id);
  }

  @Post()
  create(@Body() dto: CreateChampionshipDto, @Request() req: { user: { userId: string } }) {
    return this.repo.create({ ...dto, ownerId: req.user.userId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChampionshipDto) {
    return this.repo.update(id, { ...dto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repo.softDelete(id);
    return { message: 'Campeonato excluído' };
  }
}
