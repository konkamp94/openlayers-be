import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserLocationDto } from '../locations/dto/create-user-location.dto';
import { UpdateUserLocationDto } from '../locations/dto/update-user-location.dto';
import { UserLocation } from './entities/user-location.entity';
import { DataSource, IsNull, Not, Repository, Transaction } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PredefinedLocation } from './entities/predefined-location.entity';
import { ReorderUserLocationDto } from './dto/reorder-user-location.dto';

@Injectable()
export class LocationsService {

    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(UserLocation) private userLocationRepository: Repository<UserLocation>,
        @InjectRepository(PredefinedLocation) private predefinedLocationRepository: Repository<PredefinedLocation>) { }

    async findAllPredefinedLocations() {
        return await this.predefinedLocationRepository.find();
    }

    async createUserLocation(createUserLocationDto: CreateUserLocationDto) {
        createUserLocationDto['coordinates'] = { type: 'Point', coordinates: [createUserLocationDto.lng, createUserLocationDto.lat] };
        let newUserLocation = this.userLocationRepository.create(createUserLocationDto);

        await this.dataSource.transaction('SERIALIZABLE', async transactionalEntityManager => {
            if (await transactionalEntityManager.count(UserLocation) > 0) {
                const lastUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { nextUserLocationId: IsNull() } });
                newUserLocation.prevUserLocationId = lastUserLocation.id;
                newUserLocation.nextUserLocationId = null;
                await transactionalEntityManager.save(newUserLocation);
                lastUserLocation.nextUserLocationId = newUserLocation.id;
                await transactionalEntityManager.save(lastUserLocation);
            } else {
                newUserLocation.prevUserLocationId = null;
                newUserLocation.nextUserLocationId = null;
                await transactionalEntityManager.save(newUserLocation);
            }
        });

        return newUserLocation;

    }

    async findAllUserLocations() {
        let userLocations: UserLocation[];

        userLocations = await this.userLocationRepository.find();

        const orderedUserLocations = [];
        const userLocationsMap = {};

        // if there are no user locations, return an empty array
        if (userLocations.length === 0) {
            return orderedUserLocations;
        }

        // create a map of user locations with the id as the key
        userLocations.forEach(location => {
            userLocationsMap[location.id] = location;
        });

        // find the first user location
        let currentLocation = userLocations.find(location => location.prevUserLocationId === null);

        // add user location with order to the orderedUserLocations array
        while (currentLocation) {
            orderedUserLocations.push(currentLocation);
            const nextLocationId = currentLocation.nextUserLocationId;
            currentLocation = nextLocationId ? userLocationsMap[nextLocationId] : null;
        }

        return orderedUserLocations;
    }

    async findOneUserLocation(id: number) {
        let userLocation;
        userLocation = await this.userLocationRepository.findOne({ where: { id } });
        if (!userLocation) {
            throw new NotFoundException(`User location with id ${id} not found`);
        }
        return userLocation;
    }

    async updateUserLocation(id: number, updateUserLocationDto: UpdateUserLocationDto) {
        const updatedUserLocation = await this.findOneUserLocation(id);
        const { lat, lng, name } = updateUserLocationDto;
        updatedUserLocation.name = name || updatedUserLocation.name;
        updatedUserLocation.coordinates.coordinates = [lng || updatedUserLocation.coordinates.coordinates[0], lat || updatedUserLocation.coordinates.coordinates[1]];
        return this.userLocationRepository.save(updatedUserLocation);
    }

    async removeUserLocation(id: number) {
        await this.dataSource.transaction('SERIALIZABLE', async transactionalEntityManager => {
            const userLocation = await transactionalEntityManager.findOne(UserLocation, { where: { id } });
            if (!userLocation) {
                throw new NotFoundException(`User location with id ${id} not found`);
            }
            if (userLocation.prevUserLocationId && userLocation.nextUserLocationId) {
                const prevUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { nextUserLocationId: userLocation.id } });
                const nextUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { prevUserLocationId: userLocation.id } });
                prevUserLocation.nextUserLocationId = nextUserLocation.id;
                nextUserLocation.prevUserLocationId = prevUserLocation.id;
                await transactionalEntityManager.save(prevUserLocation);
                await transactionalEntityManager.save(nextUserLocation);
            } else if (userLocation.prevUserLocationId) {
                const prevUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { nextUserLocationId: userLocation.id } });
                prevUserLocation.nextUserLocationId = null;
                await transactionalEntityManager.save(prevUserLocation);
            } else if (userLocation.nextUserLocationId) {
                const nextUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { prevUserLocationId: userLocation.id } });
                nextUserLocation.prevUserLocationId = null;
                await transactionalEntityManager.save(nextUserLocation);
            }

            await this.userLocationRepository.remove(userLocation);
        });
    }

    async reOrderUserLocations(reorderUserLocation: ReorderUserLocationDto) {

        await this.dataSource.transaction('SERIALIZABLE', async transactionalEntityManager => {
            const userLocation = await transactionalEntityManager.findOne(UserLocation, { where: { id: reorderUserLocation.locationId } });
            if (!userLocation) {
                throw new NotFoundException(`User location with id ${reorderUserLocation.locationId} not found`);
            }

            // change indexes of the old neighbors of the reordered user location
            if (userLocation.prevUserLocationId) {
                const oldPrevUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { nextUserLocationId: userLocation.id } });
                oldPrevUserLocation.nextUserLocationId = userLocation.nextUserLocationId;
                await transactionalEntityManager.save(oldPrevUserLocation);
            }
            if (userLocation.nextUserLocationId) {
                const oldNextUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { prevUserLocationId: userLocation.id } });
                oldNextUserLocation.prevUserLocationId = userLocation.prevUserLocationId;
                await transactionalEntityManager.save(oldNextUserLocation);
            }
            // change indexes of the new neighbors of the reordered user location
            let newPrevUserLocation = null;
            let newNextUserLocation = null;

            if (reorderUserLocation.newPrevLocationId) {
                newPrevUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { id: reorderUserLocation.newPrevLocationId } });
            }

            if (reorderUserLocation.newNextLocationId) {
                newNextUserLocation = await transactionalEntityManager.findOne(UserLocation, { where: { id: reorderUserLocation.newNextLocationId } });
            }

            const newPrevUserLocationId = newPrevUserLocation ? newPrevUserLocation.id : null;
            const newNextUserLocationId = newNextUserLocation ? newNextUserLocation.id : null;

            if (newPrevUserLocation) {
                newPrevUserLocation.nextUserLocationId = userLocation.id;
                await transactionalEntityManager.save(newPrevUserLocation);
            }

            if (newNextUserLocation) {
                newNextUserLocation.prevUserLocationId = userLocation.id;
                await transactionalEntityManager.save(newNextUserLocation);
            }

            // change indexes of user location with the ids of new neighbors
            userLocation.prevUserLocationId = newPrevUserLocationId;
            userLocation.nextUserLocationId = newNextUserLocationId;
            await transactionalEntityManager.save(userLocation);
        });

    }
}

