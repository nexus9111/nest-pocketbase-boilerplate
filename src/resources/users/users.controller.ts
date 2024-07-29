import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../guards/role.decorator';
import { RoleGuard } from '../../guards/role.guard';
import { UserRole } from '../../shared/users.role';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  list() {
    return this.usersService.list();
  }

  /* -------------------------------------------------------------------------- */
  /*                                    AUTH                                    */
  /* -------------------------------------------------------------------------- */

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }
}
