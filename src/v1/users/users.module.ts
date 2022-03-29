import { Module } from '@nestjs/common';
import { Rule } from '@v1/rules/entities/rule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { UsersController } from './controllers';
import { UsersService } from './services';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Rule])],
  exports: [UsersService],
})
export class UsersModule {}
