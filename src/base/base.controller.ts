import { Delete, Get, Param, UseGuards } from '@nestjs/common';
import { WinstonProvider } from '@utils/providers';
import { JwtAuthGuard } from '@v1/auth/guards/jwt-auth.guard';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { BaseEntity } from 'typeorm';
import { BaseService } from './base.service';

@UseGuards(JwtAuthGuard)
export class BaseController {
  protected logger = new WinstonProvider();

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
