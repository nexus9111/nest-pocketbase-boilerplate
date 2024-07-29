import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnv } from '../interfaces/env.interface';
import { Reflector } from '@nestjs/core';
import { Roles } from './role.decorator';
import { UsersDBService } from '../services/database/users/usersDB.service';
import { GuardRequestKeys } from '../shared/api.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  private config: IEnv;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
    private readonly userService: UsersDBService,
  ) {
    this.config = this.configService.get<IEnv>('env');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    try {
      const userId = request[GuardRequestKeys.USER_ID];
      const token = request[GuardRequestKeys.USER_TOKEN];
      const user = await this.userService.get(userId, token);
      if (!roles.includes(user.role)) {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
