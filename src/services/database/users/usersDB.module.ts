import { Module } from '@nestjs/common';
import { UsersDBService } from './usersDB.service';
import { PocketBaseClientModule } from '../../pocketbase/pocketbaseClient.module';

@Module({
  imports: [PocketBaseClientModule],
  providers: [UsersDBService],
  exports: [UsersDBService, PocketBaseClientModule],
})
export class UsersDBModule {}
