import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '@v1/auth/entities/refresh-token.entity';
import { Role } from '@v1/roles/entities/role.entity';
import { Exclude } from 'class-transformer';
import {
  AfterLoad,
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

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  avatar: string;

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

  @Column({ default: 1 })
  public roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  public role: Role;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedAt: Date;

  @AfterLoad()
  formatImage() {
    const protocol = process.env.APP_PROTOCOL;
    const host = process.env.APP_HOST;
    const port = process.env.APP_PORT;
    const url = `${protocol}://${host}:${port}`;
    if (this.avatar) {
      this.avatar = url + this.avatar;
    }
  }
}
