import { IEnv } from '../../interfaces/env.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PocketBaseORM } from 'typescript-pocketbase-orm';

@Injectable()
export class PocketBaseClientService {
  private config: IEnv;

  constructor(readonly configService: ConfigService) {
    this.config = this.configService.get<IEnv>('env');
  }

  getPocketBase() {
    return new PocketBaseORM(this.config.POCKETBASE_ADMIN_URL);
  }

  async authenticate(pocketbase: PocketBaseORM) {
    return await pocketbase.authAdmin(
      this.config.POCKETBASE_ADMIN_EMAIL,
      this.config.POCKETBASE_ADMIN_PASSWORD,
    );
  }

  async deAuthenticate(pocketbase: PocketBaseORM) {
    return await pocketbase.logout();
  }

  async refreshAdminToken(pocketbase: PocketBaseORM) {
    return await pocketbase.refreshAdmin();
  }
}
