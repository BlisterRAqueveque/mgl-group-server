import { UsuarioDto } from 'src/users.module/users/user.dto';
import { AdjuntoDto } from '../adjuntos/adjuntos.dto';
import { PericiaDto } from '../pericias/pericias.dto';
import { TerceroDto } from '../terceros/terceros.dto';

export class InformeDto {
  id: number;
  tipo_siniestro: string;
  n_siniestro: string;
  n_denuncia: string;
  nombre_asegurado: string;
  dir_asegurado: string;
  tel_asegurado: string;
  mail_asegurado: string;
  veh_asegurado: string;
  patente_asegurado: string;
  hecho: string;
  n_poliza: string;
  tipo_cobertura: string;
  amp_denuncia: string;
  conclusion: string;
  text_anio: string;
  fecha_carga: Date;
  corregido: boolean;
  adjuntos: AdjuntoDto[];
  usuario_carga: UsuarioDto;
  pericia: PericiaDto;
  relevamiento: string;
  terceros: TerceroDto[];
  conductor: string;
  dni_conductor: string;
  terminado: boolean;
  fecha_terminado: Date;
}
