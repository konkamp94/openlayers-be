import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Point } from 'geojson';
import { on } from 'events';

@Entity()
export class PredefinedLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
    geom: Point; // (longitude, latitude)

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

    @UpdateDateColumn({ type: "timestamptz", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
    updatedAt: string;

}
