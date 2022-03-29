import { Module } from '@nestjs/common';
import { RulesController } from './controllers';
import { RulesService } from './services';

@Module({
  controllers: [RulesController],
  providers: [RulesService],
})
export class RulesModule {}
