import { UsuarioDto } from 'src/users.module/users/user.dto';
import { AseguradoraDto } from '../aseguradoras/aseguradoras.dto';
import { TipoSiniestroDto } from '../tipo-siniestros/tipo-siniestro.dto';
import { InformeDto } from '../informes/informes.dto';
import { TerceroDto } from '../terceros/terceros.dto';

export class PericiaDto {
  id: number;
  fecha_asignado: Date;
  n_siniestro: number;
  n_denuncia: number;
  nombre_asegurado: string;
  dir_asegurado: string;
  tel_asegurado: string;
  mail_asegurado: string;
  veh_asegurado: string;
  patente_asegurado: string;
  conductor: string;
  dni_conductor: string;
  abierta: boolean;
  activo: boolean;

  fecha_creado: Date;
  fecha_eliminado: Date;

  usuario_carga: UsuarioDto;
  aseguradora: AseguradoraDto;

  tipo_siniestro: TipoSiniestroDto;
  verificador: UsuarioDto;

  informe: InformeDto;

  terceros: TerceroDto[];
}
