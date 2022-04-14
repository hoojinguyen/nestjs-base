import { BaseService } from '@base/base.service';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService, PasswordService, S3Service } from '@utils/services';
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
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {
    super(usersRepository);
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create();
    await this.mapData(user, createUserDto);
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

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneOrFail({ id });
    await this.mapData(user, updateUserDto);
    return await user.save();
  }

  protected async mapData(user: User, dto: any) {
    const data = instanceToPlain(dto);

    for (const key in data) {
      switch (key) {
        case 'password':
          user[key] = await this.passwordService.hashPassword(data[key]);
          break;
        case 'avatar':
          if (data[key] && data[key] !== user[key]) {
            const { serverUpload } = this.configService.get('app');
            const fnUpload =
              serverUpload === 'local'
                ? this.fileService.moveFile(data[key])
                : this.s3Service.moveFile(data[key]);
            user[key] = await this.uploadImage(fnUpload);
          }
          break;
        default:
          user[key] = data[key];
          break;
      }
    }
  }
}
