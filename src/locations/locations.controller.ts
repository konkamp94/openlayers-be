import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateUserLocationDto } from '../locations/dto/create-user-location.dto';
import { UpdateUserLocationDto } from '../locations/dto/update-user-location.dto';
import { ReorderUserLocationDto } from './dto/reorder-user-location.dto';

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationService: LocationsService) { }

    @Get('predefined-location')
    async findAllPredefinedLocations() {
        return await this.locationService.findAllPredefinedLocations();
    }

    @Post('user-location')
    async createUserLocation(@Body() createUserLocationDto: CreateUserLocationDto) {
        return await this.locationService.createUserLocation(createUserLocationDto);
    }

    @Get('user-location')
    async findAllUserLocations() {
        return await this.locationService.findAllUserLocations();
    }

    @Get('user-location/:id')
    async findOneUserLocation(@Param('id') id: string) {
        return await this.locationService.findOneUserLocation(+id);
    }

    @Patch('user-location/:id')
    async updateUserLocation(@Param('id') id: string, @Body() updateUserLocationDto: UpdateUserLocationDto) {
        return await this.locationService.updateUserLocation(+id, updateUserLocationDto);
    }

    @Post('user-location/re-order')
    async reOrderUserLocations(@Body() reorderUserLocation: ReorderUserLocationDto) {
        if (!reorderUserLocation.newPrevLocationId && !reorderUserLocation.newNextLocationId) {
            throw new BadRequestException('Both prevLocationId and nextLocationId cannot be null');
        }
        await this.locationService.reOrderUserLocations(reorderUserLocation)
        return this.locationService.findAllUserLocations();
    }

    @Delete('user-location/:id')
    async removeUserLocation(@Param('id') id: string) {
        return await this.locationService.removeUserLocation(+id);
    }
}
