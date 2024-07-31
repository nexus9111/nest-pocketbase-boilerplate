import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../guards/role.decorator';
import { RoleGuard } from '../../guards/role.guard';
import { UserRole } from '../../shared/users.role';
import {
  ConfirmPasswordResetDto,
  RequestPasswordResetDto,
} from './dto/password-change.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  list(@Request() req) {
    return this.usersService.list(req);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/profile')
  profile(@Request() req) {
    return this.usersService.profile(req);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    AUTH                                    */
  /* -------------------------------------------------------------------------- */

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/request-password-reset')
  requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.usersService.requestPasswordReset(requestPasswordResetDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/confirm-password-reset')
  confirmPasswordReset(@Body() confirmPasswordReset: ConfirmPasswordResetDto) {
    return this.usersService.confirmPasswordReset(confirmPasswordReset);
  }
}
