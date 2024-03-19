import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  Headers,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsuarioDto } from './user.dto';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly auth: AuthService,
  ) {}

  /** @description Endpoint para crear un nuevo usuario */
  @Post('auth/register')
  async register(@Body() user: UsuarioDto, @Res() res: Response) {
    const result = await this.userService.register(user);
    if (result)
      res.status(HttpStatus.CREATED).json({
        ok: true,
        result,
        msg: 'Created',
      });
    else
      res.status(HttpStatus.BAD_REQUEST).json({
        ok: false,
        msg: 'Rejected',
      });
  }

  /** @description Endpoint para el login del usuario */
  @Post('auth/login')
  async login(@Body() credentials: any, @Res() res: Response) {
    const result = await this.userService.login(
      credentials.username,
      credentials.password,
    );
    if (result)
      res.status(HttpStatus.OK).json({
        ok: true,
        result,
        msg: 'Approved',
      });
    else
      res.status(HttpStatus.BAD_REQUEST).json({
        ok: false,
        msg: 'Rejected',
      });
  }

  /** @description Retorna la lista de usuarios, cual paginator o todos, en caso de ser necesario. */
  @Get()
  async getAllFilter(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('filterBy') filterBy: string,
    @Query('sortBy') sortBy: string,
    @Res() res: Response,
  ) {
    const result = await this.userService.getAllFilter(
      page,
      perPage,
      filterBy,
      sortBy,
    );
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.userService.getOne(id);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Get('user/info')
  async getUserInfo(
    @Headers('authorization') token: string,
    @Res() res: Response,
  ) {
    try {
      /**
       * Obtenemos el token de la cabecera, y con split, separamos el Bearer Token, del token real.
       * Verificamos su credibilidad, y retornamos el id.
       */
      const payload = await this.auth.verifyJwt(token.split(' ')[1]);
      //* Realizamos la consulta a la base de datos y retornamos la información.
      const user = await this.userService.getUser(payload.username);
      user.contrasenia = '****';
      res.status(HttpStatus.OK).json({
        ok: true,
        user,
        msg: 'Approved',
      });
    } catch (e: any) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        ok: false,
        e,
        msg: 'Unauthorized',
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Headers('authorization') token: string,
    @Body() user: Partial<UsuarioDto>,
    @Res() res: Response,
  ) {
    let result
    if(!id || id.toString() === '0') {
      const payload = await this.auth.verifyJwt(token.split(' ')[1]);
      result = await this.userService.update(payload.sub, user);
    }
    else {
      result = await this.userService.update(id, user);
    }
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }
}
