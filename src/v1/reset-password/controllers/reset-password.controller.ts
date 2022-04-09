import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InstanceToJsonInterceptor } from '@v1/users/interceptors';
import { UsersService } from '@v1/users/services';
import { CreateResetTokenDto, ResetPasswordDto } from '../dtos';
import { JwtResetAuthGuard } from '../guards';
import { ResetPasswordService } from '../services';

@Controller()
export class ResetPasswordController {
  constructor(
    private readonly passwordResetService: ResetPasswordService,
    private readonly usersService: UsersService,
  ) {
    // empty
  }

  @Post()
  public create(@Body() createResetTokenDto: CreateResetTokenDto) {
    return this.passwordResetService.create(createResetTokenDto);
  }

  @UseGuards(JwtResetAuthGuard)
  @UseInterceptors(InstanceToJsonInterceptor)
  @Get(':resetToken')
  public async findOne(@Req() request) {
    return await this.usersService.findOneOrFail({ id: request.user.id });
  }

  @UseGuards(JwtResetAuthGuard)
  @UseInterceptors(InstanceToJsonInterceptor)
  @Put(':resetToken')
  public update(@Req() request, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.passwordResetService.update(request.user.id, resetPasswordDto);
  }
}
