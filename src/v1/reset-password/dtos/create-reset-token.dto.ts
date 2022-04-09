import { IsNotEmpty } from 'class-validator';

export class CreateResetTokenDto {
  @IsNotEmpty()
  public email: string;
}
