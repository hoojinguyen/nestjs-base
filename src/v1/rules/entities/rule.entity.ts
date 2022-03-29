import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from '@v1/roles/entities';

export enum PermissionRule {
  ALLOW = 'allow',
  DENY = 'deny',
}

@Entity({ name: 'rules' })
export class Rule {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public roleId: number;

  @Column()
  public resourceId: string;

  @ManyToOne(() => Role, (role) => role.rules)
  public role: Role;

  @Column({
    type: 'enum',
    enum: PermissionRule,
    default: PermissionRule.DENY,
  })
  public permission: PermissionRule;
}
