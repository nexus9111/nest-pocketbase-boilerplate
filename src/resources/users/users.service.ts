import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IEnv } from '../../interfaces/env.interface';
import { ConfigService } from '@nestjs/config';
import { UsersDBService } from '../../services/database/users/usersDB.service';
import { LoginDto } from './dto/login.dto';
import { AuthUser } from '../../services/database/users/usersDB.adapter';
import { InternalServerError } from 'typescript-pocketbase-orm/dist/errors';

@Injectable()
export class UsersService {
  private config: IEnv;

  constructor(
    private configService: ConfigService,
    private readonly userService: UsersDBService,
  ) {
    this.config = this.configService.get<IEnv>('env');
  }

  async list() {
    return await this.userService.list();
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
}
