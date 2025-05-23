import { Controller, Post, Get, Patch, Body, Param, BadRequestException } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ParkingSlot } from './interfaces/parking-lot.interface';

interface InitializeParkingLotDto {
    no_of_slot: number;
}

interface ExpandParkingLotDto {
    increment_slot: number;
}

interface ParkCarDto {
    car_reg_no: string;
    car_color: string;
}

interface FreeSlotDto {
    slot_number?: number;
    car_registration_no?: string;
}

@Controller('parking_lot')
export class ParkingLotController {
    constructor(private readonly parkingLotService: ParkingLotService) { }

    @Post()
    initializeParkingLot(@Body() body: InitializeParkingLotDto) {
        return this.parkingLotService.initializeParkingLot(body.no_of_slot);
    }


    @Patch()
    expandParkingLot(@Body() body: ExpandParkingLotDto) {
        return this.parkingLotService.expandParkingLot(body.increment_slot);
    }



    @Post('park')
    parkCar(@Body() body: ParkCarDto) {
        return this.parkingLotService.parkCar({
            registrationNumber: body.car_reg_no,
            color: body.car_color,
            enteredtime: new Date()
        });
    }

    @Post('clear')
    freeSlot(@Body() body: FreeSlotDto) {
        if (body.slot_number) {
            return this.parkingLotService.freeSlot(body.slot_number);
        } else if (body.car_registration_no) {
            return this.parkingLotService.freeSlot(undefined, body.car_registration_no);
        } else {
            throw new BadRequestException('Either slot_number or car_registration_no must be provided');
        }
    }

    @Get('status')
    getStatus(): ParkingSlot[] {
        return this.parkingLotService.getStatus();
    }
    

    @Get('registration_numbers/:color')
    getCarsByColor(@Param('color') color: string) {
        return this.parkingLotService.getCarsByColor(color);
    }


    @Get('slot_numbers/:color')
    getSlotsByColor(@Param('color') color: string) {
        return this.parkingLotService.getSlotsByColor(color);
    }


    @Get('slot/:registrationNumber')
    getSlotByRegistrationNumber(@Param('registrationNumber') registrationNumber: string) {
        return this.parkingLotService.getSlotByRegistrationNumber(registrationNumber);
    }

    
} 