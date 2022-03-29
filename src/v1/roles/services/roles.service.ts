import { BaseService } from '@base/base.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { UpdateRoleDto } from '../dtos';
import { Role } from '../entities';
import { ExceptionsResponse } from '../exceptions';

@Injectable()
export class RolesService extends BaseService {
  protected filterableColumns: any = {
    name: [FilterOperator.EQ],
  };

  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {
    super(rolesRepository);
  }

  public async findOneOrFail(options: FindConditions<Role>): Promise<Role> {
    const role = await this.rolesRepository.findOne(options);

    if (!role) {
      throw new UnprocessableEntityException(ExceptionsResponse.roleNotFound);
    }

    return role;
  }

  public async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOneOrFail({ id });
    await this.mapData(role, updateRoleDto);
    return await role.save();
  }
}
