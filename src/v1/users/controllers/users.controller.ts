import { BaseController } from '@/src/base/base.controller';
import { CacheService } from '@/src/utils/services';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RolesGuard } from '@v1/roles/guards';
// import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { CreateUserDto, UpdateUserDto } from '../dtos';
// import { User } from '../entities';
import { InstanceToJsonInterceptor } from '../interceptors';
import { UsersService } from '../services';

@Controller()
@UseGuards(RolesGuard)
@UseInterceptors(InstanceToJsonInterceptor)
export class UsersController extends BaseController {
  constructor(
    private readonly userService: UsersService,
    private readonly cacheService: CacheService,
  ) {
    super(userService);
  }

  // Example get data by using cache
  // @Get('cache')
  // public findAllWithCache(
  //   @Paginate() query: PaginateQuery,
  // ): Promise<Paginated<User>> {
  //   return this.userService.findAllWithCache(query, this.cacheService);
  // }

  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.userService.findOne({ id: id });
  }

  @Put(':id')
  public update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
