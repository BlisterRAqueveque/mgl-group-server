import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InformeEntity } from './informes.entity';
import { Repository } from 'typeorm';
import { InformeDto } from './informes.dto';

@Injectable()
export class InformesService {
  constructor(
    @InjectRepository(InformeEntity)
    private readonly repository: Repository<InformeDto>,
  ) {}

  async insert(informe: InformeDto): Promise<InformeDto> {
    try {
      const result = await this.repository.save(informe);
      return result;
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
}
