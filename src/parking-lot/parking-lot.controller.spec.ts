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

    
}); 