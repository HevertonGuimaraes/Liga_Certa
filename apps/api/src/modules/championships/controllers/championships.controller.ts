import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaChampionshipRepository } from '../repositories/prisma-championship.repository';
import { IsString, MinLength, IsOptional, IsDateString } from 'class-validator';

class CreateChampionshipDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() season!: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
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
}
