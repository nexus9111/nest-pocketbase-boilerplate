import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersDBModule } from '../../services/database/users/usersDB.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    UsersDBModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
