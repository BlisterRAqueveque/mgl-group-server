import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from 'src/configurations/envs';
import { AuthService } from './auth/auth.service';
import { UsuarioEntity } from './users/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity]),
    JwtModule.register({
      secret: envs.SEED,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [AuthService, UsersService],
})
export class UsersModule {}
