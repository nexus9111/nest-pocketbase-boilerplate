import { Module } from '@nestjs/common';
import { PocketBaseClientService } from './pocketbaseClient.service';

@Module({
  providers: [PocketBaseClientService],
  exports: [PocketBaseClientService],
})
export class PocketBaseClientModule {}
