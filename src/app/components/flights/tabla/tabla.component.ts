import { Component, Input } from '@angular/core';
import { FlightList } from 'src/app/interfaces/flight.interface';
import { Journey } from 'src/app/models/journey';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent {
  @Input() flightList: FlightList[] = [];
  @Input()journey!: Journey;

  //Variables
  @Input() arrivalStations: string[] = [];
  @Input() departureStations: string[] = [];

  @Input() viewInfo: boolean = false;
  @Input() totalPrice: number = 0;
  @Input() firstPrice: number = 0;
  @Input() secondPrice: number = 0;
}
