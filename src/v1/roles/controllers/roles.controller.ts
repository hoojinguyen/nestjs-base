import { BaseController } from '@base/base.controller';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { RolesService } from '../services';

@Controller()
export class RolesController extends BaseController {
  constructor(private readonly rolesService: RolesService) {
    super(rolesService);
  }

  @Get(':id')
  public async findOne(@Param('id') id: number) {
    return await this.rolesService.findOne({ id }, { relations: ['rules'] });
  }

  @Post()
  public create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  public update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }
}
