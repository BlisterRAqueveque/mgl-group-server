import { AdjuntoDto } from '../adjuntos/adjuntos.dto';
import { InformeDto } from '../informes/informes.dto';
import { PericiaDto } from '../pericias/pericias.dto';

export class TerceroDto {
  id: number;
  nombre: string;
  domicilio: string;
  tel: string;
  veh: string;
  patente: string;
  mail_tercero: string;
  amp_denuncia: string;
  aseguradora: string;
  anio: number;
  poliza: string;
  cobertura: string;

  pericia: PericiaDto;
  informe: InformeDto;
  adjuntos: AdjuntoDto[];
}
