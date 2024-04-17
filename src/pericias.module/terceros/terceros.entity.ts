import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PericiaEntity } from '../pericias/pericias.entity';
import { InformeEntity } from '../informes/informes.entity';
import { AdjuntoEntity } from '../adjuntos/adjuntos.entity';

@Entity('terceros')
export class TerceroEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar', { length: 250, nullable: true })
  nombre: string;
  @Column('text', { nullable: true })
  domicilio: string;
  @Column('text', { nullable: true })
  tel: string;
  @Column('text', { nullable: true })
  veh: string;
  @Column('text', { nullable: true })
  patente: string;
  @Column('text', { nullable: true })
  amp_denuncia: string;
  @Column('varchar', { length: 250, nullable: true })
  aseguradora: string;
  @Column('bigint', { nullable: true })
  anio: number;
  @Column('text', { nullable: true })
  poliza: string;
  @Column('text', { nullable: true })
  cobertura: string;

  @ManyToOne(() => PericiaEntity, (pericia) => pericia.terceros)
  pericia: PericiaEntity;

  @ManyToOne(() => InformeEntity, (informe) => informe.terceros)
  informe: InformeEntity;

  @OneToMany(() => AdjuntoEntity, (adjunto) => adjunto.tercero, {
    cascade: true,
  })
  adjuntos: AdjuntoEntity[];
}
