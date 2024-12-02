import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Point } from 'geojson';

@Entity()
export class UserLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
    coordinates: Point; // (longitude, latitude)

    @Column({ type: 'int', nullable: true })
    prevUserLocationId: number | null;

    @Column({ type: 'int', nullable: true })
    nextUserLocationId: number | null;

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

    @UpdateDateColumn({ type: "timestamptz", onUpdate: "CURRENT_TIMESTAMP", nullable: true })
    updatedAt: string;
}