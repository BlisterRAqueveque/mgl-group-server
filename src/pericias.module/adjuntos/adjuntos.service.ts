import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdjuntoEntity } from './adjuntos.entity';
import { Repository } from 'typeorm';
import { AdjuntoDto } from './adjuntos.dto';

@Injectable()
export class AdjuntosService {
  constructor(
    @InjectRepository(AdjuntoEntity)
    private readonly repo: Repository<AdjuntoDto>,
  ) {}

  async delete(id: number) {
    try {
      const e = await this.repo.findOne({ where: { id: id } });
      return this.repo.delete(e);
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
}
