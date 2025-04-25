export interface Car {
    registrationNumber: string;
    color: string;
}

export interface ParkingSlot {
    slotNumber: number;
    car: Car | null;
} 