import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Expose } from 'class-transformer';

export class BaseEntity {
  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn()
  deletedAt: Date;

  @Expose()
  @PrimaryGeneratedColumn()
  id: number;
}
