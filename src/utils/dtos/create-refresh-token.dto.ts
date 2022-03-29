import { IsNotEmpty } from 'class-validator';

export class CreateRefreshTokenDto {
  public id: number = null;

  @IsNotEmpty()
  public userId: number;

  @IsNotEmpty()
  public isRevoked: boolean;

  @IsNotEmpty()
  public expires: Date;

  constructor(refreshToken) {
    this.userId = refreshToken.userId;
    this.isRevoked = refreshToken.isRevoked;
    this.expires = refreshToken.expires;
  }
}
