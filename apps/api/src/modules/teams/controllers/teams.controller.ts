import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaTeamRepository } from '../repositories/prisma-team.repository';
import { IsString, MinLength, MaxLength, IsUUID } from 'class-validator';

class CreateTeamDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) @MaxLength(5) shortName!: string;
  @IsUUID() championshipId!: string;
}

@Controller('teams')
@UseGuards(AuthGuard('jwt'))
export class TeamsController {
  constructor(private readonly repo: PrismaTeamRepository) {}

  @Get()
  findAll() {
    return this.repo.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.repo.create(dto);
  }
}
