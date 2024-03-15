import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ')
      const decodedToken = await this.authService.verifyJwt(tokenArray[1])
      
      const user = await this.userService.getUser(decodedToken.username)
      
      if(decodedToken) {
          if(user.id === decodedToken.sub) next()
          else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
      }
      else {
          throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
      }
  }
  catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
  }
  }
}
