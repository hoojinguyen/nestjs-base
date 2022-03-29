import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PermissionRule, Rule } from '../../rules/entities/rule.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  protected version = 'v1';
  protected allRule = 'all';

  constructor(
    private reflector: Reflector,
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
  ) {
    // empty
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const controllerName = context.getClass().name;
    const actionName = context.getHandler().name;

    const requireRule = `${this.version}|${controllerName}|${actionName}`;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const rule = await this.ruleRepository.findOne({
      where: {
        roleId: user.roleId,
        resourceId: In([requireRule, this.allRule]),
      },
    });

    return rule?.permission === PermissionRule.ALLOW;
  }
}
