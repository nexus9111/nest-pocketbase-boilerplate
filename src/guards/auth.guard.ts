import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IEnv } from '../interfaces/env.interface';
import { ApiCustomResponse, GuardRequestKeys } from '../shared/api.enum';
import { PocketBaseClientService } from '../services/pocketbase/pocketbaseClient.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private config: IEnv;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly database: PocketBaseClientService,
  ) {
    this.config = this.configService.get<IEnv>('env');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const db = this.database.getPocketBase();
      await db.verifyToken(token);
      const { id } = await this.jwtService.decode(token);
      request[GuardRequestKeys.USER_ID] = id;
      request[GuardRequestKeys.USER_TOKEN] = token;
    } catch (e) {
      try {
        const { exp } = await this.jwtService.decode(token);
        if (exp < Date.now() / 1000) {
          throw new UnauthorizedException(ApiCustomResponse.EXPIRED_TOKEN);
        }
        throw new UnauthorizedException();
      } catch (error) {
        throw new UnauthorizedException();
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
