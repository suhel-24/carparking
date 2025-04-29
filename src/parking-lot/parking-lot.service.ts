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

    freeSlot(slotNumber?: number, registrationNumber?: string): { freedSlotNumber: number,price : number } {
        let slot: ParkingSlot | undefined;

        if (slotNumber) {
            slot = this.parkingSlots.find(s => s.slotNumber === slotNumber);
            if (!slot) {
                throw new NotFoundException(`Slot ${slotNumber} not found`);
            }
        } else if (registrationNumber) {
            slot = this.parkingSlots.find(s => s.car?.registrationNumber === registrationNumber);
            if (!slot) {
                throw new NotFoundException(`Car with registration number ${registrationNumber} not found`);
            }
        } else {
            throw new BadRequestException('Either slot number or registration number must be provided');
        }

        if (!slot.car) {
            throw new BadRequestException('Slot is already free');
        }
        let leavingtime=new Date();

        let enteredTime=slot.car.enteredtime;

        const timeParked=leavingtime.getMinutes()-enteredTime.getMinutes()
        console.log(leavingtime.getHours(),enteredTime.getHours())

        const priceToBePaid=10*timeParked



        slot.car = null;
        return { freedSlotNumber: slot.slotNumber, price: priceToBePaid };
    }

    getStatus(): ParkingSlot[] {
        return this.parkingSlots.filter(slot => slot.car !== null);
    }

    getCarsByColor(color: string): string[] {
        return this.parkingSlots
            .filter(slot => slot.car?.color.toLowerCase() === color.toLowerCase())
            .map(slot => slot.car!.registrationNumber);
    }

    getSlotsByColor(color: string): number[] {
        return this.parkingSlots
            .filter(slot => slot.car?.color.toLowerCase() === color.toLowerCase())
            .map(slot => slot.slotNumber);
    }


    getSlotByRegistrationNumber(registrationNumber: string): number {
        const slot = this.parkingSlots.find(
            s => s.car?.registrationNumber.toLowerCase() === registrationNumber.toLowerCase(),
        );
        if (!slot) {
            throw new NotFoundException(`Car with registration number ${registrationNumber} not found`);
        }
        return slot.slotNumber;
    }

    private isParkingLotFull(): boolean {
        return this.parkingSlots.every(slot => slot.car !== null);
    }
} 