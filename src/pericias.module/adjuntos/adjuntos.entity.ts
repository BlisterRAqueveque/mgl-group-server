import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InformeEntity } from '../informes/informes.entity';

@Entity('adjuntos')
export class AdjuntoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('text', { nullable: true })
  adjunto: string;
  @Column('text', { nullable: true })
  descripcion: string;
  @Column('int', { default: 0 })
  index: number;

  @ManyToOne(() => InformeEntity, (informe) => informe.adjuntos)
  informe: InformeEntity;
}
