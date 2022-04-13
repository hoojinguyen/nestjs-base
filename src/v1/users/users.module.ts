import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from '@v1/rules/entities/rule.entity';
import { UsersController } from './controllers';
import { User } from './entities';
import { UsersService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rule])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
