import { IsExist } from '@utils/validate-decorators';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../entities';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsExist(
    {
      message: 'Email $value already exists. Choose another email.',
    },
    [User],
  )
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsBoolean()
  public isActive: boolean;

  @IsOptional()
  @IsBoolean()
  public isDelete: boolean;
}
