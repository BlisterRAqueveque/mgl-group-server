import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { TipoSiniestrosService } from './tipo-siniestros.service';
import { Response } from 'express';
import { AseguradoraDto } from '../aseguradoras/aseguradoras.dto';

@Controller('tipo-siniestros')
export class TipoSiniestrosController {
    constructor(private readonly tipoSiniestroService: TipoSiniestrosService) {}

  @Get()
  async getAllFilter(
    @Query('id') id: number,
    @Query('nombre') nombre: string,
    @Query('activo') activo: boolean,
    @Query('fecha_creado') fecha_creado: Date,
    @Query('usuario_carga') usuario_carga: string,
    @Query('sortBy') sortBy: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('relations') relations: boolean,
    @Res() res: Response,
  ) {
    const result = await this.tipoSiniestroService.getAllFilter(
      id,
      nombre,
      activo,
      fecha_creado,
      usuario_carga,
      sortBy,
      page,
      perPage,
      relations,
    );
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Get(':id')
  async getOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.tipoSiniestroService.getOne(id);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Post()
  async insert(@Body() aseguradora: AseguradoraDto, @Res() res: Response) {
    const result = await this.tipoSiniestroService.insert(aseguradora);
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved',
    });
  }

  @Delete(':id')
  async softDelete(@Param('id') id: number, @Res() res: Response) {
    const result = await this.tipoSiniestroService.softDelete(id)
    res.status(HttpStatus.OK).json({
      ok: true,
      result,
      msg: 'Approved'
    })
  }
}
