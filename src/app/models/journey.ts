import { Flight } from "./flight";

export class Journey {

    constructor(
        public flight: Flight[],
        public origin: string,
        public destination: string,
        public price: number
    ){}
}