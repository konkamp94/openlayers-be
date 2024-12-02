import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLocation } from './entities/user-location.entity';
import { PredefinedLocation } from './entities/predefined-location.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([UserLocation, PredefinedLocation]), HttpModule],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule { }
