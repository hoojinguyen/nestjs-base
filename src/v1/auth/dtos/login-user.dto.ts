import { User } from '@v1/users/entities/user.entity';

export class LoginUserDto {
  public username: string;
  public password: string;
  public user: User;
}
