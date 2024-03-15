import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './user.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { UsuarioDto } from './user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly userRepo: Repository<UsuarioDto>,
    private readonly authService: AuthService,
  ) {}

  /** @description Crea un nuevo usuario */
  async register(user: UsuarioDto) {
    try {
      const availability = await this.checkAvailability(user.username);
      if (!availability) throw new ConflictException('username already taken');
      const hashPassword = await this.authService.hashPassword(user.contrasenia);
      user.contrasenia = hashPassword;
      user.username = user.username.toLowerCase();
      user.email = user.email.toLowerCase();
      const result = await this.userRepo.save(user);
      return result;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
  /** @description Comprueba la disponibilidad del usuario por el username. */
  private async checkAvailability(username: string) {
    try {
      const availability = await this.userRepo.findOne({
        where: { username: username },
      });
      if (availability) return false;
      else return true;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Login del usuario, genera el token */
  async login(username: string, password: string) {
    try {
      const user = await this.getUser(username);
      const checkPass = await this.authService.comparePassword(
        password,
        user.contrasenia,
      );
      if (!checkPass) throw new UnauthorizedException('wrong credentials');
      const result = {
        token: await this.authService.generateJwt(user),
        user,
      };
      return result;
    } catch (e: any) {
      console.log(e)
      throw new HttpException(e.message ? e.message : 'Server error', e.status ? e.status : 500);
    }
  }

  /** @description Devuelve la información del usuario */
  async getUser(username: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { username: username },
      });
      if (!user) throw new NotFoundException('entity not found');
      return user;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Retorna todos los usuarios. Funciona como paginator en caso de que se envíe undefined
   * pages y perPage */
  async getAllFilter(
    page: number,
    perPage: number,
    filterBy: string,
    sortBy: string,
  ) {
    const conditions: FindOptionsWhere<UsuarioDto>[] = [];

    if (filterBy) {
      conditions.push(
        { nombre: Like(`%${filterBy}%`) },
        { apellido: Like(`%${filterBy}%`) },
        { username: Like(`%${filterBy}%`) },
        { email: Like(`%${filterBy}%`) },
      );
    }

    const [entities, count] = await this.userRepo.findAndCount({
      where: conditions,
      skip: page !== undefined ? (page - 1) * perPage : 0,
      take: perPage,
      order: {
        id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        username: true,
      },
    });
    return { entities, count }
  }
}
