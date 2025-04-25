import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLotService } from './parking-lot.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ParkingLotController', () => {
    let controller: ParkingLotController;
    let service: ParkingLotService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ParkingLotController],
            providers: [ParkingLotService],
        }).compile();

        controller = module.get<ParkingLotController>(ParkingLotController);
        service = module.get<ParkingLotService>(ParkingLotService);
    });

    describe('initializeParkingLot', () => {
        it('should initialize parking lot with given number of slots', () => {
            const result = controller.initializeParkingLot({ no_of_slot: 6 });
            expect(result).toEqual({ totalSlots: 6 });
        });

        it('should throw BadRequestException for invalid slot number', () => {
            expect(() => controller.initializeParkingLot({ no_of_slot: 0 }))
                .toThrow(BadRequestException);
        });
    });

    describe('expandParkingLot', () => {
        beforeEach(() => {
            controller.initializeParkingLot({ no_of_slot: 6 });
        });

        it('should expand parking lot by given number of slots', () => {
            const result = controller.expandParkingLot({ increment_slot: 3 });
            expect(result).toEqual({ totalSlots: 9 });
        });

        it('should throw BadRequestException for invalid increment', () => {
            expect(() => controller.expandParkingLot({ increment_slot: 0 }))
                .toThrow(BadRequestException);
        });
    });

    describe('parkCar', () => {
        beforeEach(() => {
            controller.initializeParkingLot({ no_of_slot: 2 });
        });

        it('should park a car and return allocated slot number', () => {
            const result = controller.parkCar({
                car_reg_no: 'KA-01-HH-1234',
                car_color: 'white',
            });
            expect(result).toEqual({ allocatedSlotNumber: 1 });
        });

        it('should throw BadRequestException when parking lot is full', () => {
            controller.parkCar({ car_reg_no: 'KA-01-HH-1234', car_color: 'white' });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1235', car_color: 'blue' });
            expect(() => controller.parkCar({ car_reg_no: 'KA-01-HH-1236', car_color: 'red' }))
                .toThrow(BadRequestException);
        });
    });

    describe('freeSlot', () => {
        beforeEach(() => {
            controller.initializeParkingLot({ no_of_slot: 2 });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1234', car_color: 'white' });
        });

        it('should free slot by slot number', () => {
            const result = controller.freeSlot({ slot_number: 1 });
            expect(result).toEqual({ freedSlotNumber: 1 });
        });

        it('should free slot by registration number', () => {
            const result = controller.freeSlot({ car_registration_no: 'KA-01-HH-1234' });
            expect(result).toEqual({ freedSlotNumber: 1 });
        });

        it('should throw NotFoundException for non-existent slot', () => {
            expect(() => controller.freeSlot({ slot_number: 3 }))
                .toThrow(NotFoundException);
        });

        it('should throw NotFoundException for non-existent car', () => {
            expect(() => controller.freeSlot({ car_registration_no: 'KA-01-HH-9999' }))
                .toThrow(NotFoundException);
        });
    });

    describe('getStatus', () => {
        beforeEach(() => {
            controller.initializeParkingLot({ no_of_slot: 2 });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1234', car_color: 'white' });
        });

        it('should return occupied slots', () => {
            const result = controller.getStatus();
            expect(result).toEqual([
                {
                    slotNumber: 1,
                    car: {
                        registrationNumber: 'KA-01-HH-1234',
                        color: 'white',
                    },
                },
            ]);
        });
    });

    describe('getCarsByColor', () => {
        beforeEach(() => {
            controller.initializeParkingLot({ no_of_slot: 3 });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1234', car_color: 'white' });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1235', car_color: 'blue' });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1236', car_color: 'white' });
        });

        it('should return registration numbers of cars with given color', () => {
            const result = controller.getCarsByColor('white');
            expect(result).toEqual(['KA-01-HH-1234', 'KA-01-HH-1236']);
        });

        it('should return empty array for non-existent color', () => {
            const result = controller.getCarsByColor('red');
            expect(result).toEqual([]);
        });
    });

    describe('getSlotsByColor', () => {
        beforeEach(() => {
            controller.initializeParkingLot({ no_of_slot: 3 });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1234', car_color: 'white' });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1235', car_color: 'blue' });
            controller.parkCar({ car_reg_no: 'KA-01-HH-1236', car_color: 'white' });
        });

        it('should return slot numbers of cars with given color', () => {
            const result = controller.getSlotsByColor('white');
            expect(result).toEqual([1, 3]);
        });

        it('should return empty array for non-existent color', () => {
            const result = controller.getSlotsByColor('red');
            expect(result).toEqual([]);
        });
    });

    
}); 