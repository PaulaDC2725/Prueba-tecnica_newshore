import { Flight } from '../models/flight';

export interface FlightState {
    loading: boolean;
    flight: ReadonlyArray<Flight>;
}

export interface FlightList {
    departureStation: string,
    arrivalStation: string,
    flightCarrier: string,
    flightNumber: string,
    price: number
}
