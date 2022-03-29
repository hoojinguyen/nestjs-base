import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Rule } from '@v1/rules/entities';
import { User } from '@v1/users/entities';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(() => Rule, (rule) => rule.role)
  public rules: Rule[];

  @OneToMany(() => User, (user) => user.role)
  public users: User[];

  @Column({ default: 0 })
  public sortOrder: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}
