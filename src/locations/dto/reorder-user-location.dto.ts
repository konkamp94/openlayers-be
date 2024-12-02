import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Not } from "typeorm";

export class ReorderUserLocationDto {
    @IsNumber()
    @IsNotEmpty()
    locationId: number;

    // the validation for not both being null is done in the controller
    @IsNumber()
    @IsOptional()
    newPrevLocationId?: number;

    @IsNumber()
    @IsOptional()
    newNextLocationId?: number;
}
