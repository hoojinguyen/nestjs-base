import { Controller, Get } from '@nestjs/common';

import { RulesService } from '../services';

@Controller()
export class RulesController {
  constructor(private readonly rulesService: RulesService) {
    // empty
  }

  @Get()
  public async findAll() {
    return await this.rulesService.loadACL();
  }
}
