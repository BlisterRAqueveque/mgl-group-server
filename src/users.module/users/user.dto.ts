import { AseguradoraDto } from 'src/pericias.module/aseguradoras/aseguradoras.dto';
import { PericiaDto } from 'src/pericias.module/pericias/pericias.dto';
import { TipoSiniestroDto } from 'src/pericias.module/tipo-siniestros/tipo-siniestro.dto';
import { Roles } from './user.entity';
import { InformeDto } from 'src/pericias.module/informes/informes.dto';

export class UsuarioDto {
  id: number;
  nombre: string;
  apellido: string;
  contrasenia: string;
  username: string;
  email: string;
  tel: string;
  activo: boolean;
  superuser: boolean;
  rol: Roles;

  fecha_creado: Date;
  fecha_eliminado: Date;

  usuario_carga: UsuarioDto;
  usuarios_creados: UsuarioDto;
  carga_pericia: PericiaDto[];
  pericia: PericiaDto[];

  tipo_siniestro: TipoSiniestroDto[];

  aseguradora: AseguradoraDto[];

  informes: InformeDto[]
}
