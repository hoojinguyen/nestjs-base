import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { RefreshToken } from '@v1/auth/entities/refresh-token.entity';
import { Role } from '@v1/roles/entities/role.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public email: string;

  @Exclude()
  @Column()
  public password: string;

  @Exclude()
  @Column({ type: 'text', nullable: true })
  public resetToken: string;

  @Exclude()
  @Column({ type: 'timestamp', default: () => null, nullable: true })
  public resetSentAt: Date;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ default: false })
  public isDelete: boolean;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  public refreshTokens: RefreshToken[];

  @Column()
  public roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  public role: Role;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;
}
