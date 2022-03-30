import { IsExist } from '@utils/validate-decorators';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../entities';

export class CreateUserDto {
  public id: number = null;

  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
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
  public password: string;

  @IsBoolean()
  public isActive: boolean;

  @IsBoolean()
  public isDelete: boolean;
}
