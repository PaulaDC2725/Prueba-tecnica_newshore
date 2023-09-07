import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/environment';
import { Flight } from '../../models/flight';
import { Observable } from 'rxjs';
import { Journey } from 'src/app/models/journey';

@Injectable({
    providedIn: 'root'
})
export class FlightService {

    api: string = environment.api;

    constructor(private http: HttpClient) { }

    getFlight() {
        return this.http.get<Flight[]>(this.api);
    }
}
