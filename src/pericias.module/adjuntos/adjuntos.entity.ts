import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InformeEntity } from '../informes/informes.entity';
import { TerceroEntity } from '../terceros/terceros.entity';

@Entity('adjuntos')
export class AdjuntoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('text', { nullable: true })
  adjunto: string;
  @Column('text', { nullable: true })
  descripcion: string;
  @Column('text', { nullable: true })
  type: string;
  @Column('bigint', { default: 0 })
  index: number;
  @Column('varchar', { length: 250, nullable: true })
  dot: string;

  @ManyToOne(() => InformeEntity, (informe) => informe.adjuntos)
  informe: InformeEntity;

  @ManyToOne(() => TerceroEntity, (tercero) => tercero.adjuntos)
  tercero: TerceroEntity;
}
