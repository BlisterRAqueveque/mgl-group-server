import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PericiaEntity } from '../pericias/pericias.entity';
import { InformeEntity } from '../informes/informes.entity';

@Entity('terceros')
export class TerceroEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar', { length: 250, nullable: true })
  nombre: string;
  @Column('varchar', { length: 250, nullable: true })
  dni: string;
  @Column('varchar', { length: 250, nullable: true })
  aseguradora: string;

  @ManyToOne(() => PericiaEntity, (pericia) => pericia.terceros)
  pericia: PericiaEntity;

  @ManyToOne(() => InformeEntity, (informe) => informe.terceros)
  informe: InformeEntity;
}
