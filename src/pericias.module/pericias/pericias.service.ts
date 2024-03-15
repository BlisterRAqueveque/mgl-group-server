import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PericiaEntity } from './pericias.entity';
import { PericiaDto } from './pericias.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  Between,
  Like,
  FindOptionsOrder,
  FindManyOptions,
} from 'typeorm';

@Injectable()
export class PericiasService {
  constructor(
    @InjectRepository(PericiaEntity)
    private readonly periciaRepo: Repository<PericiaDto>,
  ) {}

  /** @description Obtenemos un paginator para traer la información, junto con un filtro */
  async getAllFilter(
    id: number,
    activo: boolean,
    fecha_creado: Date,
    verificador: string,
    n_siniestro: number,
    n_denuncia: number,
    nombre_asegurado: string,
    usuario_carga: string,
    sortBy: string,
    page: number,
    perPage: number,
    relations?: boolean,
  ) {
    try {
      const skip = page !== undefined ? (page - 1) * perPage : 0;

      //! Set the conditions:
      const conditions: FindOptionsWhere<PericiaDto> = {};
      if (id) conditions.id = id;
      if (activo) conditions.activo = activo;
      if (fecha_creado) {
        const date = new Date(fecha_creado);
        date.setDate(date.getDate() + 1);
        conditions.fecha_creado = Between(new Date(fecha_creado), date);
      }
      if (verificador)
        conditions.verificador = [
          { username: Like(`%${verificador}%`) },
          { nombre: Like(`%${verificador}%`) },
          { apellido: Like(`%${verificador}%`) },
        ];
      if (n_siniestro) conditions.n_siniestro = Like(n_siniestro);
      if (n_denuncia) conditions.n_denuncia = Like(n_denuncia);
      if (nombre_asegurado)
        conditions.nombre_asegurado = Like(nombre_asegurado);
      if (usuario_carga)
        conditions.usuario_carga = [
          { nombre: Like(`%${usuario_carga}%`) },
          { apellido: Like(`%${usuario_carga}%`) },
        ];

      const order: FindOptionsOrder<PericiaDto> = sortBy
        ? {
            id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
          }
        : { nombre_asegurado: 'ASC' };

      //! Creates the finding options
      const findOptions: FindManyOptions<PericiaDto> = {
        where: conditions,
        skip: skip,
        take: perPage,
        order: order,
        relations: {
          usuario_carga: relations !== undefined ? relations : true,
          verificador: relations !== undefined ? relations : true,
        },
        select: {
          usuario_carga: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            tel: true,
          },
          verificador: {
            id: true,
            username: true,
            nombre: true,
            apellido: true,
            tel: true,
          },
          id: true,
          activo: true,
          fecha_creado: true,
          n_siniestro: true,
          n_denuncia: true,
          nombre_asegurado: true,
        },
      };
      const [entities, count] =
        await this.periciaRepo.findAndCount(findOptions);
      return { entities, count };
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.activo);
    }
  }

  /** @description Obtenemos un registro con sus relaciones */
  async getOne(id: number): Promise<PericiaDto> {
    try {
      const entity = await this.periciaRepo.findOne({
        where: { id: id },
        relations: {
          usuario_carga: true,
          aseguradora: true,
          tipo_siniestro: true,
          verificador: true,
        },
        select: {
          usuario_carga: {
            id: true,
            nombre: true,
            apellido: true,
            tel: true,
            email: true,
          },
          verificador: {
            id: true,
            username: true,
            nombre: true,
            apellido: true,
            tel: true,
          },
        },
      });
      if (!entity) throw new NotFoundException('entity not found');
      return entity;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Inserta una nueva entidad */
  async insert(pericia: PericiaDto): Promise<PericiaDto> {
    try {
      const result = await this.periciaRepo.save(pericia);
      return result;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Realiza un Soft Delete de la entidad. No elimina la misma, sino que le agrega una "fecha de eliminado" */
  async softDelete(id: number) {
    try {
      const entity = await this.periciaRepo.findOne({ where: { id: id } });
      if (!entity) throw new NotFoundException('entity not found');
      const result = await this.periciaRepo.softRemove(entity);
      return result;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }
}