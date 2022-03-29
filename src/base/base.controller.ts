import { Delete, Get, Param, UseGuards } from '@nestjs/common';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { BaseService } from './base.service';
import { JwtAuthGuard } from '../v1/auth/guards/jwt-auth.guard';
import { BaseEntity } from 'typeorm';

@UseGuards(JwtAuthGuard)
export class BaseController {
  constructor(private readonly service: BaseService) {
    // empty
  }

  @Get()
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<BaseEntity>> {
    return this.service.findAll(query);
  }

  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
