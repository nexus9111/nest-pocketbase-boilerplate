import {
  Injectable,
  InternalServerErrorException,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { IEnv } from '../../interfaces/env.interface';
import { ConfigService } from '@nestjs/config';
import { UsersDBService } from '../../services/database/users/usersDB.service';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from '../../services/database/users/usersDB.adapter';
import { InternalServerError } from 'typescript-pocketbase-orm/dist/errors';
import {
  ConfirmPasswordResetDto,
  RequestPasswordResetDto,
} from './dto/password-change.dto';
import { GuardRequestKeys } from '../../shared/api.enum';

@Injectable()
export class UsersService {
  private config: IEnv;

  constructor(
    private configService: ConfigService,
    private readonly userService: UsersDBService,
  ) {
    this.config = this.configService.get<IEnv>('env');
  }

  async list(@Request() req) {
    return await this.userService.list(req[GuardRequestKeys.USER_TOKEN]);
  }

  async profile(@Request() req) {
    return await this.userService.get(
      req[GuardRequestKeys.USER_ID],
      req[GuardRequestKeys.USER_TOKEN],
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                    AUTH                                    */
  /* -------------------------------------------------------------------------- */

  async login(loginDto: LoginDto): Promise<AuthUser> {
    try {
      return await this.userService.auth(loginDto);
    } catch (error) {
      if (error instanceof InternalServerError) {
        throw new InternalServerErrorException();
      }

      throw new UnauthorizedException();
    }
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    return await this.userService.requestPasswordReset(
      requestPasswordResetDto.email,
    );
  }

  async confirmPasswordReset(confirmPasswordResetDto: ConfirmPasswordResetDto) {
    return await this.userService.confirmPasswordReset(confirmPasswordResetDto);
  }
}
