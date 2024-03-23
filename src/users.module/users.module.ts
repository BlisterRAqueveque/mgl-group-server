import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule], //! docker compose
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SEED'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [AuthService, UsersService],
})
export class UsersModule {}
