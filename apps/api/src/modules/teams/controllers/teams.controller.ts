import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaTeamRepository } from '../repositories/prisma-team.repository';
import { IsString, MinLength, MaxLength, IsUUID, IsOptional } from 'class-validator';

class CreateTeamDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(2) @MaxLength(5) shortName!: string;
  @IsUUID() championshipId!: string;
}

class UpdateTeamDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(5) shortName?: string;
  @IsOptional() @IsUUID() championshipId?: string;
}

@Controller('teams')
@UseGuards(AuthGuard('jwt'))
export class TeamsController {
  constructor(private readonly repo: PrismaTeamRepository) {}

  @Get()
  findAll(@Query('championshipId') championshipId?: string) {
    return this.repo.findAll(championshipId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repo.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.repo.create({ ...dto });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.repo.update(id, { ...dto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repo.softDelete(id);
    return { message: 'Time excluído' };
  }
}
