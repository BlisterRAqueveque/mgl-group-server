import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PericiaDto } from './pericias.dto';
import { PericiasService } from './pericias.service';

@Controller('pericias')
export class PericiasController {
  constructor(private readonly periciaService: PericiasService) {}

  @Get('get/form-format')
  async getFormFormat(@Res() res: Response) {
    const result = await this.periciaService.getFormFormat();
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Get()
  async getAllFilter(
    @Query('id') id: number,
    @Query('activo') activo: boolean,
    @Query('fecha_creado') fecha_creado: Date,
    @Query('verificador') verificador: string | number,
    @Query('n_siniestro') n_siniestro: number,
    @Query('n_denuncia') n_denuncia: number,
    @Query('nombre_asegurado') nombre_asegurado: string,
    @Query('aseguradora') aseguradora: string,
    @Query('usuario_carga') usuario_carga: string,
    @Query('informe') informe: boolean,
    @Query('limite') limite: boolean,
    @Query('sortBy') sortBy: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('relations') relations: boolean,
    @Query('terminado') terminado: boolean,
    @Res() res: Response,
  ) {
    const result = await this.periciaService.getAllFilter(
      id,
      activo,
      fecha_creado,
      verificador,
      n_siniestro,
      n_denuncia,
      nombre_asegurado,
      aseguradora,
      usuario_carga,
      informe,
      limite,
      sortBy,
      page,
      perPage,
      relations,
      terminado,
    );
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.periciaService.getOne(id);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Post()
  async insert(@Body() pericia: PericiaDto, @Res() res: Response) {
    const result = await this.periciaService.insert(pericia);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number, @Res() res: Response) {
    const result = await this.periciaService.softDelete(id);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() pericia: Partial<PericiaDto>,
    @Res() res: Response,
  ) {
    const result = await this.periciaService.update(id, pericia);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }
}
