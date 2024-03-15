import { AseguradoraDto } from 'src/pericias.module/aseguradoras/aseguradoras.dto';
import { PericiaDto } from 'src/pericias.module/pericias/pericias.dto';
import { TipoSiniestroDto } from 'src/pericias.module/tipo-siniestros/tipo-siniestro.dto';
import { Roles } from './user.entity';

export class UsuarioDto {
  id: number;
  nombre: string;
  apellido: string;
  contrasenia: string;
  username: string;
  email: string;
  tel: string;
  superuser: boolean;
  rol: Roles;

  carga_pericia: PericiaDto[];
  pericia: PericiaDto[];

  tipo_siniestro: TipoSiniestroDto[];

  aseguradora: AseguradoraDto[];
}
