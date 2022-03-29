import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  public id: number;
}
