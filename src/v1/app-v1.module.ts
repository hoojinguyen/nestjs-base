import { Module } from '@nestjs/common';
import { AppV1Route } from './app-v1.route';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { RulesModule } from './rules/rules.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppV1Route,
    AuthModule,
    UsersModule,
    RulesModule,
    RolesModule,
    // ResetPasswordModule
  ],
})
export class AppV1Module {
  // empty
}
