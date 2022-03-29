import { BaseService } from '@base/base.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '@utils/services';
import { instanceToPlain } from 'class-transformer';
import { FilterOperator } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';
import { ExceptionsResponse } from '../exceptions';

@Injectable()
export class UsersService extends BaseService {
  protected filterableColumns: any = {
    email: [FilterOperator.EQ],
  };

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {
    super(usersRepository);
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await this.passwordService.hashPassword(createUserDto.password),
    });

    return await user.save();
  }

  public async findOneOrFail(
    findConditions: FindConditions<User>,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    const user = await this.usersRepository.findOne(findConditions, options);

    if (!user) {
      throw new UnprocessableEntityException(ExceptionsResponse.userNotFound);
    }

    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneOrFail({ id });
    await this.mapData(user, updateUserDto);
    return await user.save();
  }

  protected async mapData(user, dto) {
    const data = instanceToPlain(dto);

    for (const key in data) {
      if (key === 'password') {
        user[key] = await this.passwordService.hashPassword(data[key]);
      } else {
        user[key] = data[key];
      }
    }
  }
}
