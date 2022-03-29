import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  public id: number = null;

  @IsNotEmpty()
  public name: string;

  public sortOrder: number;
}
