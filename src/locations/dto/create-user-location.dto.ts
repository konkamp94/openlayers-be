import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserLocationDto {
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(-90)
    @Max(90)
    lat: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(-180)
    @Max(180)
    lng: number;
}
