import { BaseController } from '@/src/base/base.controller';
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
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { InstanceToJsonInterceptor } from '../interceptors';
import { UsersService } from '../services';

@Controller()
@UseGuards(RolesGuard)
@UseInterceptors(InstanceToJsonInterceptor)
export class UsersController extends BaseController {
  constructor(private readonly userService: UsersService) {
    super(userService);
  }

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
