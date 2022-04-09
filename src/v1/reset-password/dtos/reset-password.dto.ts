import { Match } from '@/src/utils/validate-decorators';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  @Match('password')
  public password_confirmation: string;
}
