import { Transport } from "./transport";

export class Flight{
    
    constructor(
        public transport: Transport,
        public origin: string,
        public destination: string,
        public prices: number
    ){}
}