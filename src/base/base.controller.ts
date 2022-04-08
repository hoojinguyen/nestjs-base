import { Body, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@v1/auth/guards/jwt-auth.guard';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { BaseEntity } from 'typeorm';
import { DeleteByIdsDto } from './base.dto';
import { BaseService } from './base.service';

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

  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.service.findOne({ id: id });
  }

  @Delete()
  public deleteByIds(@Body() { ids }: DeleteByIdsDto) {
    return this.service.deleteByIds(ids);
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.service.delete(+id);
  }
}
