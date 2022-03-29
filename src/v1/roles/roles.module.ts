import { Module } from '@nestjs/common';
import { Role } from './entities';
import { RolesController } from './controllers';
import { RolesService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Role])],
})
export class RolesModule {}
