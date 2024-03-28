import { UsuarioEntity } from 'src/users.module/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdjuntoEntity } from '../adjuntos/adjuntos.entity';
import { PericiaEntity } from '../pericias/pericias.entity';

@Entity('informes')
export class InformeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('text')
  tipo_siniestro: string;
  @Column('text')
  n_siniestro: string;
  @Column('text')
  n_denuncia: string;
  @Column('text')
  nombre_asegurado: string;
  @Column('text')
  dir_asegurado: string;
  @Column('text')
  tel_asegurado: string;
  @Column('text')
  veh_asegurado: string;
  @Column('text')
  patente_asegurado: string;
  @Column('text')
  hecho: string;
  @Column('text')
  n_poliza: string;
  @Column('text')
  tipo_cobertura: string;
  @Column('text')
  amp_denuncia: string;
  @Column('text')
  conclusion: string;
  @Column('text')
  text_anio: string;
  @CreateDateColumn()
  fecha_carga: Date;
  @OneToMany(() => AdjuntoEntity, (adjuntos) => adjuntos.informe, {
    cascade: true,
  })
  adjuntos: AdjuntoEntity[];
  @ManyToOne(() => UsuarioEntity, (usuario_carga) => usuario_carga.informes)
  usuario_carga: UsuarioEntity;
  @OneToOne(() => PericiaEntity, (pericia) => pericia.informe)
  @JoinColumn()
  pericia: PericiaEntity;
}
