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

  async getDashboard() {
    try {
      const aseguradoras = await this.aseguradoraService.getCountAseguradoras();
      const pericias = await this.periciaService.getCountPericias();
      const tipoSiniestro = await this.tipoSiniestro.getCountTipoSiniestros();
      const usuarios = await this.userService.getCountUsuarios();
      return { aseguradoras, pericias, tipoSiniestro, usuarios };
    } catch (e: any) {
      throw new HttpException(e.message, e.status);
    }
  }
}
