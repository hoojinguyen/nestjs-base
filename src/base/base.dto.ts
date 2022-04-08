import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class DeleteByIdsDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  public ids: number[];
}
