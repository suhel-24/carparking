export interface Car {
    registrationNumber: string;
    color: string;
    enteredtime : Date;
}

export interface ParkingSlot {
    slotNumber: number;
    car: Car | null;
} 