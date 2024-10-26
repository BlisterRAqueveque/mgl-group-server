import { HttpException, Injectable } from '@nestjs/common';
import { AseguradorasService } from './pericias.module/aseguradoras/aseguradoras.service';
import { PericiasService } from './pericias.module/pericias/pericias.service';
import { TipoSiniestrosService } from './pericias.module/tipo-siniestros/tipo-siniestros.service';
import { UsersService } from './users.module/users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly aseguradoraService: AseguradorasService,
    private readonly periciaService: PericiasService,
    private readonly tipoSiniestro: TipoSiniestrosService,
    private readonly userService: UsersService,
  ) {}

  async getDashboard(id: number) {
    try {
      const aseguradoras = await this.aseguradoraService.getCountAseguradoras();
      const pericias = await this.periciaService.getCountPericias(id);
      const tipoSiniestro = await this.tipoSiniestro.getCountTipoSiniestros();
      const usuarios = await this.userService.getCountUsuarios();
      return { aseguradoras, pericias, tipoSiniestro, usuarios };
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }

  async getFilterData() {
    try {
      const verificadores = (
        await this.userService.getAllFilter(
          undefined,
          true,
          undefined,
          undefined,
          undefined,
          'asc',
          false,
        )
      ).entities;

      const aseguradoras = (
        await this.aseguradoraService.getAllFilter(
          undefined,
          undefined,
          undefined,
          true,
          undefined,
          undefined,
          'asc',
          undefined,
          undefined,
          false,
        )
      ).entities;

      return { verificadores, aseguradoras };
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
}
