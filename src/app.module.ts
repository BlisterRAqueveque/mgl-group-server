import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './configurations/config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users.module/users.module';
import { AuthMiddleware } from './users.module/auth/auth.middleware';
import { PericiasModule } from './pericias.module/pericias.module';
import * as express from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), // Import config
    TypeOrmModule.forRoot(dbConfig), UsersModule, PericiasModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  //! Apply the middleware for all the routes
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AuthMiddleware,
        express.json({ limit: '50mb' }),
        express.urlencoded({ limit: '50mb', extended: true }),
      )
      .exclude(
        //! Except:
        {
          path: '/users/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: '/users/auth/register',
          method: RequestMethod.POST,
        }
      )
      .forRoutes('');
  }
}
