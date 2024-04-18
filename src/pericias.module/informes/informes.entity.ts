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
import { TerceroEntity } from '../terceros/terceros.entity';

@Entity('informes')
export class InformeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('text', { nullable: true })
  tipo_siniestro: string;
  @Column('text', { nullable: true })
  n_siniestro: string;
  @Column('text', { nullable: true })
  n_denuncia: string;
  @Column('text', { nullable: true })
  nombre_asegurado: string;
  @Column('text', { nullable: true })
  dir_asegurado: string;
  @Column('text', { nullable: true })
  tel_asegurado: string;
  @Column('text', { nullable: true })
  mail_asegurado: string;
  @Column('text', { nullable: true })
  veh_asegurado: string;
  @Column('text', { nullable: true })
  patente_asegurado: string;
  @Column('text', { nullable: true })
  hecho: string;
  @Column('text', { nullable: true })
  n_poliza: string;
  @Column('text', { nullable: true })
  tipo_cobertura: string;
  @Column('text', { nullable: true })
  amp_denuncia: string;
  @Column('text', { nullable: true })
  conclusion: string;
  @Column('text', { nullable: true })
  text_anio: string;
  @CreateDateColumn()
  fecha_carga: Date;
  @Column('text', { nullable: true })
  relevamiento: string;
  @OneToMany(() => AdjuntoEntity, (adjuntos) => adjuntos.informe, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  adjuntos: AdjuntoEntity[];
  @ManyToOne(() => UsuarioEntity, (usuario_carga) => usuario_carga.informes)
  usuario_carga: UsuarioEntity;
  @OneToOne(() => PericiaEntity, (pericia) => pericia.informe)
  @JoinColumn()
  pericia: PericiaEntity;
  @OneToMany(() => TerceroEntity, (terceros) => terceros.informe, {
    cascade: true,
  })
  terceros: TerceroEntity[];

  @Column('varchar', { length: 250 })
  conductor: string;
  @Column('varchar', { length: 250 })
  dni_conductor: string;
}
