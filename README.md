# Car Parking System API

A RESTful API for managing a car parking system built with NestJS and TypeScript. This system allows for automated parking management without human intervention.

## Features

- Initialize parking lot with specified number of slots
- Expand parking lot capacity
- Park cars with automatic slot allocation
- Free parking slots
- Query parking status
- Search cars by color
- Search slots by color
- Find slot by registration number

## Tech Stack

- NestJS
- TypeScript
- Jest (for testing)

## Installation

```bash
# Install dependencies
npm install

# Run the application
npm run start:dev

# Run tests
npm test
```

## API Documentation

### 1. Initialize Parking Lot
Initialize a new parking lot with specified number of slots.

```http
POST /parking_lot
```

**Request Body:**
```json
{
  "no_of_slot": 6
}
```

**Response:**
```json
{
  "totalSlots": 6
}
```

### 2. Expand Parking Lot
Add more slots to the existing parking lot.

```http
PATCH /parking_lot
```

**Request Body:**
```json
{
  "increment_slot": 3
}
```

**Response:**
```json
{
  "totalSlots": 9
}
```

### 3. Park a Car
Allocate a parking slot to a car.

```http
POST /parking_lot/park
```

**Request Body:**
```json
{
  "car_reg_no": "KA-01-HH-1234",
  "car_color": "white"
}
```

**Response:**
```json
{
  "allocatedSlotNumber": 1
}
```

### 4. Free a Slot
Free a parking slot by slot number or registration number.

```http
POST /parking_lot/clear
```

**Request Body (by slot number):**
```json
{
  "slot_number": 1
}
```

**Request Body (by registration number):**
```json
{
  "car_registration_no": "KA-01-HH-1234"
}
```

**Response:**
```json
{
  "freedSlotNumber": 1
}
```

### 5. Get Parking Status
Get information about all occupied slots.

```http
GET /parking_lot/status
```

**Response:**
```json
[
  {
    "slotNumber": 1,
    "car": {
      "registrationNumber": "KA-01-HH-1234",
      "color": "white"
    }
  },
  {
    "slotNumber": 2,
    "car": {
      "registrationNumber": "KA-01-HH-1235",
      "color": "blue"
    }
  }
]
```

### 6. Get Cars by Color
Get registration numbers of all cars with a specific color.

```http
GET /parking_lot/registration_numbers/:color
```

**Response:**
```json
["KA-01-HH-1234", "KA-01-HH-1236"]
```

### 7. Get Slots by Color
Get slot numbers of all cars with a specific color.

```http
GET /parking_lot/slot_numbers/:color
```

**Response:**
```json
[1, 3]
```

### 8. Get Slot by Registration Number
Get slot number for a specific car registration number.

```http
GET /parking_lot/slot/:registrationNumber
```

**Response:**
```json
1
```

## Error Responses

### Bad Request (400)
```json
{
  "statusCode": 400,
  "message": "Parking lot is full",
  "error": "Bad Request"
}
```

### Not Found (404)
```json
{
  "statusCode": 404,
  "message": "Car with registration number KA-01-HH-1234 not found",
  "error": "Not Found"
}
```

## Testing

The project includes comprehensive unit tests for all API endpoints. Run tests using:

```bash
npm test
```

For test coverage:
```bash
npm run test:cov
```

## Design Considerations

1. **Error Handling**: Comprehensive error handling for all edge cases.
2. **Type Safety**: Full TypeScript support with proper interfaces and types.
3. **RESTful Design**: Follows REST principles with appropriate HTTP methods and status codes.

