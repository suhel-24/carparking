import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Car, ParkingSlot } from './interfaces/parking-lot.interface';

@Injectable()
export class ParkingLotService {
    private parkingSlots: ParkingSlot[] = [];
    private totalSlots: number = 0;

    initializeParkingLot(size: number): { totalSlots: number } {
        if (size <= 0) {
            throw new BadRequestException('Parking lot size must be greater than 0');
        }
        this.totalSlots = size;
        this.parkingSlots = Array.from({ length: size }, (_, i) => ({
            slotNumber: i + 1,
            car: null,
        }));
        return { totalSlots: size };
    }

    expandParkingLot(increment: number): { totalSlots: number } {
        if (increment <= 0) {
            throw new BadRequestException('Increment must be greater than 0');
        }
        const newSlots = Array.from({ length: increment }, (_, i) => ({
            slotNumber: this.totalSlots + i + 1,
            car: null,
        }));
        this.parkingSlots = [...this.parkingSlots, ...newSlots];
        this.totalSlots += increment;
        return { totalSlots: this.totalSlots };
    }

    parkCar(car: Car): { allocatedSlotNumber: number } {
        if (this.isParkingLotFull()) {
            throw new BadRequestException('Parking lot is full');
        }

        const availableSlot = this.parkingSlots.find(slot => slot.car === null);
        if (!availableSlot) {
            throw new BadRequestException('No available slots');
        }

        availableSlot.car = car;
        return { allocatedSlotNumber: availableSlot.slotNumber };
    }

    

    private isParkingLotFull(): boolean {
        return this.parkingSlots.every(slot => slot.car !== null);
    }
} 