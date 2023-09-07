import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Journey } from '../../models/journey';
import { FlightList } from 'src/app/interfaces/flight.interface';
import Swal from 'sweetalert2';
import { FlightService } from '../services/flight.service';
import { FormularioComponent } from './formulario/formulario.component';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css'],
})
export class FlightsComponent implements OnInit {
  invalidFunction : boolean = false;
  form : any;
  @Input() flightList: FlightList[] = [];
  journey!: Journey;

  //Variables
  @Input() arrivalStations: string[] = [];
  @Input()departureStations: string[] = [];

  viewInfo: boolean = false;
  totalPrice: number = 0;
  firstPrice: number = 0;
  secondPrice: number = 0;

  constructor(private componenteFormulario: FormularioComponent) {
    this.invalidFunction= this.componenteFormulario.invalidField();
    this.form = this.componenteFormulario.form;
  }

  ngOnInit(): void {
    //Función para calcular tamaños de componentes / divs en el proyecto
    setTimeout(() => {
      this.calculationSize();
    }, 100);
  }
  getViewInfo(valor : boolean){
    this.viewInfo = valor;
    console.log(this.viewInfo)
  }
  getJourney(valor: Journey){
    this.journey = valor;
    console.log(this.journey)
  }
  getTotalPrice(valor: number){
    this.totalPrice = valor;
    console.log(this.totalPrice);
  }
  getFirstPrice(valor: number){
    this.firstPrice = valor;
    console.log(this.firstPrice);
  }
  getSecondPrice(valor: number){
    this.secondPrice = valor;
    console.log(this.secondPrice);
  }
  //
  @HostListener('window:resize', ['$event']) Resolucion() {
    setTimeout(() => {
      this.calculationSize();
    }, 500);
  }
  /* Calcular tamaño para componentes de la página */
  calculationSize() {
    let body = $('#body');
    let header = $('#header');
    let footer = $('#footer');
    let pagina: any = $('#pagina');

    let heightBody: any = body.height();
    let heightFooter: any = header.height();
    let heightHeader: any = footer.height();
    let suma1: any = heightFooter + heightHeader;
    let sumaTotal: any = heightBody - suma1;

    pagina.css('height', `${sumaTotal}px`);
  }
}
