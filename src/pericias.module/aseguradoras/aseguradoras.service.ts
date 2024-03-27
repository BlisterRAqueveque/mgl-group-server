import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AseguradoraEntity } from './aseguradoras.entity';
import {
  Between,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
import { AseguradoraDto } from './aseguradoras.dto';

@Injectable()
export class AseguradorasService {
  constructor(
    @InjectRepository(AseguradoraEntity)
    private readonly aseguradoraRepo: Repository<AseguradoraDto>,
  ) {}

  /** @description Obtenemos un paginator para traer la información, junto con un filtro */
  async getAllFilter(
    id: number,
    nombre: string,
    CUIT: string,
    activo: boolean,
    fecha_creado: Date,
    usuario_carga: string,
    sortBy: string,
    page: number,
    perPage: number,
    relations?: boolean,
  ) {
    try {
      const skip = page !== undefined ? (page - 1) * perPage : 0;

      //! Set the conditions:
      const conditions: FindOptionsWhere<AseguradoraDto> = {};
      if (id) conditions.id = id;
      if (fecha_creado) {
        const date = new Date(fecha_creado);
        date.setDate(date.getDate() + 1);
        conditions.fecha_creado = Between(new Date(fecha_creado), date);
      }
      if (activo) conditions.activo = activo;
      if (nombre) conditions.nombre = Like(`%${nombre}%`);
      if (usuario_carga)
        conditions.usuario_carga = [
          { nombre: Like(`%${usuario_carga}%`) },
          { apellido: Like(`%${usuario_carga}%`) },
        ];
      if (CUIT) conditions.CUIT = Like(`%${CUIT}%`);

      const order: FindOptionsOrder<AseguradoraDto> = sortBy
        ? {
            id: sortBy === 'ASC' ? 'ASC' : sortBy === 'DESC' ? 'DESC' : 'DESC',
          }
        : { nombre: 'ASC' };

      //! Creates the finding options
      const findOptions: FindManyOptions<AseguradoraDto> = {
        where: conditions,
        skip: skip,
        take: perPage,
        order: order,
        relations: {
          usuario_carga: relations !== undefined ? relations : true,
          pericia: relations !== undefined ? relations : true,
        },
        select: {
          usuario_carga: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      };
      const [entities, count] =
        await this.aseguradoraRepo.findAndCount(findOptions);
      return { entities, count };
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.activo);
    }
  }

  /** @description Obtenemos un registro con sus relaciones */
  async getOne(id: number): Promise<AseguradoraDto> {
    try {
      const entity = await this.aseguradoraRepo.findOne({
        where: { id: id },
        relations: { usuario_carga: true, pericia: true },
        select: {
          usuario_carga: {
            id: true,
            nombre: true,
            apellido: true,
            tel: true,
            email: true,
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
  async insert(aseguradora: AseguradoraDto): Promise<AseguradoraDto> {
    try {
      //! Se quita la comprobación de carga duplicada
      // const entity = await this.aseguradoraRepo.findOne({
      //   where: { CUIT: aseguradora.CUIT },
      // });
      // if (entity) return entity;
      const result = await this.aseguradoraRepo.save(aseguradora);
      const entity = await this.aseguradoraRepo.findOne({
        where: { id: result.id },
        relations: {
          usuario_carga: true,
          pericia: true,
        },
      });
      return entity;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Realiza un Soft Delete de la entidad. No elimina la misma, sino que le agrega una "fecha de eliminado" */
  async softDelete(id: number) {
    try {
      const entity = await this.aseguradoraRepo.findOne({ where: { id: id } });
      if (!entity) throw new NotFoundException('entity not found');
      const result = await this.aseguradoraRepo.softRemove(entity);
      return result;
    } catch (e: any) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }

  /** @description Hace un update de la información del tipo de siniestro. */
  async update(
    id: number,
    siniestro: Partial<AseguradoraDto>,
  ): Promise<AseguradoraDto> {
    try {
      const entity = await this.aseguradoraRepo.findOne({
        where: { id: id },
      });
      const mergeEntity = await this.aseguradoraRepo.merge(entity, siniestro);
      const result = await this.aseguradoraRepo.save(mergeEntity);
      return result;
    } catch (e) {
      throw new HttpException(e.message, e.status);
    }
  }

  async getCountAseguradoras(): Promise<{ activos: number; inactivos: number }> {
    try {
      const activos = await this.aseguradoraRepo.count({
        where: { activo: true },
      });
      const inactivos = await this.aseguradoraRepo.count({
        where: { activo: false },
      });
      return { activos, inactivos };
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
}
