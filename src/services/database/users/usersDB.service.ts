import { ConfigService } from '@nestjs/config';
import { IEnv } from '../../../interfaces/env.interface';
import { PocketBaseClientService } from '../../pocketbase/pocketbaseClient.service';
import { Injectable } from '@nestjs/common';
import {
  AuthAdapter,
  AuthUser,
  DBAuthUser,
  DBUser,
  User,
  UserAdapter,
  UsersAdapter,
} from './usersDB.adapter';
import { findByIdQuery } from 'typescript-pocketbase-orm/dist/interfaces';

export interface Auth {
  email: string;
  password: string;
}

@Injectable()
export class UsersDBService {
  private config: IEnv;

  constructor(
    private configService: ConfigService,

    private readonly database: PocketBaseClientService,
  ) {
    this.config = this.configService.get<IEnv>('env');
  }

  async list(): Promise<User[]> {
    const db = this.database.getPocketBase();
    await this.database.authenticate(db);
    const res: DBUser[] = await db.findAll({
      collection: 'users',
    });

    return UsersAdapter(res);
  }

  async get(id: string, token?: string): Promise<User> {
    const db = this.database.getPocketBase();
    if (token) {
      db.loadToken(token);
    }
    await this.database.authenticate(db);
    const res: DBUser = await db.findById({
      collection: 'users',
      id,
    } as findByIdQuery);

    return UserAdapter(res);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    AUTH                                    */
  /* -------------------------------------------------------------------------- */

  async auth(auth: Auth): Promise<AuthUser> {
    const db = this.database.getPocketBase();
    const res: DBAuthUser = await db.authUser(auth.email, auth.password);
    return AuthAdapter(res);
  }
}
