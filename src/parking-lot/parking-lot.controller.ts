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
        });
    }

    
} 