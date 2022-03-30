import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { RulesModule } from './rules/rules.module';
import { UsersModule } from './users/users.module';

const routes: Routes = [
  {
    path: 'v1',
    children: [
      { path: 'auth', module: AuthModule },
      { path: 'users', module: UsersModule },
      { path: 'rules', module: RulesModule },
      { path: 'roles', module: RolesModule },
      //   { path: 'reset-password', module: ResetPasswordModule },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule],
})
export class AppV1Route {}
