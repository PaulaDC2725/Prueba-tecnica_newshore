import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Journey } from '../../models/journey';
import { FlightList } from 'src/app/interfaces/flight.interface';
import Swal from 'sweetalert2';
import { FlightService } from '../services/flight.service';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css'],
})
export class FlightsComponent implements OnInit {
  //Immportación modelos de las clases
  flightList: FlightList[] = [];
  journey!: Journey;

  //Variables
  arrivalStations: string[] = [];
  departureStations: string[] = [];

  viewInfo: boolean = false;
  totalPrice: number = 0;
  firstPrice: number = 0;
  secondPrice: number = 0;

  //Declaración formulario e inputs
  form: FormGroup = this.fb.group({
    origin: ['', [Validators.required, Validators.minLength(3)]], //Validaciones cantidad de caracteres permitidos y obligatoriedad
    destination: ['', [Validators.required, Validators.minLength(3)]],
    currency: [''],
  });

  constructor(private fb: FormBuilder, private serviceFlight: FlightService) {}

  ngOnInit(): void {
    //Función para calcular tamaños de componentes / divs en el proyecto
    setTimeout(() => {
      this.calculationSize();
    }, 100);
    this.validateCurrency();
    this.getInfo();
  }

  //funcion para realizar el consumo de la API
  getInfo() {
    this.serviceFlight
      .getFlight()
      .toPromise()
      .then((resp: any) => {
        this.flightList = resp;
      });
  }
  //Validacion campos iguales
  invalidField() {
    return this.form.value.origin == this.form.value.destination;
  }
  // calcular rutas
  calculateRoute() {
    //declaración variables
    this.viewInfo = false;
    this.form.controls.currency.setValue('');
    let origin = this.form.value.origin.toUpperCase();
    let destination = this.form.value.destination.toUpperCase();
    let newOrigins: string[] = [];
    let possibleFlights: FlightList[] = [];

    //pushear variables para lograr identifiacar que los datos ingresados en el formulario existan en el servicio
    for (let i in this.flightList) {
      this.arrivalStations.push(this.flightList[i].arrivalStation);
      this.departureStations.push(this.flightList[i].departureStation);
    }

    //validación datos existentes
    if (
      this.arrivalStations.includes(origin) &&
      this.departureStations.includes(destination)
    ) {
      for (let i in this.flightList) {
        //Recorrer los arrays para identificar si el vuelo es directo o no
        if (
          this.flightList[i].departureStation === origin &&
          this.flightList[i].arrivalStation === destination
        ) {
          this.totalPrice = this.flightList[i].price;
          this.journey = {
            origin,
            destination,
            price: this.flightList[i].price,
            flight: [
              {
                origin: this.flightList[i].departureStation,
                destination: this.flightList[i].arrivalStation,
                prices: this.flightList[i].price,
                transport: {
                  flightCarrier: this.flightList[i].flightCarrier,
                  flightNumber: this.flightList[i].flightNumber,
                },
              },
            ],
          };
          this.viewInfo = true;
          break;
        } else if (
          this.flightList[i].departureStation === destination &&
          this.flightList[i].arrivalStation === origin
        ) {
          this.totalPrice = this.flightList[i].price;
          this.journey = {
            origin,
            destination,
            price: this.flightList[i].price,
            flight: [
              {
                origin: this.flightList[i].departureStation,
                destination: this.flightList[i].arrivalStation,
                prices: this.flightList[i].price,
                transport: {
                  flightCarrier: this.flightList[i].flightCarrier,
                  flightNumber: this.flightList[i].flightNumber,
                },
              },
            ],
          };
          this.viewInfo = true;
          break;
        } else if (this.flightList[i].departureStation === destination) {
          // en caso de no ser directo guarda en la variable possibleFlights y newOrigins la información que coincide con el destino del formulario
          possibleFlights.push(this.flightList[i]);
          newOrigins.push(this.flightList[i].arrivalStation);
        }
      }
      //Posteriormete de no ser directo el vuelo se llama la funcion this.getAvailableRoutes() para validar coincidencias y obtener el vuelo adicional
      !this.viewInfo
        ? this.getAvailableRoutes(
            newOrigins,
            origin,
            destination,
            possibleFlights
          )
        : '';
    } else {
      // En caso de que los datos ingresados en el formulario no existan en el servicio se mostrará la siguiente alerta
      Swal.fire({
        icon: 'error',
        title: 'No existe ruta para ese origin y/o destination',
      });
      this.viewInfo = false;
    }
    //Se realiza el calculo del tamaño de los componentes
    this.calculationSize();
  }

  //Función para validar rutas adicionales para el destino
  getAvailableRoutes(
    origins: string[],
    origin: string,
    destination: string,
    possibleFlights: FlightList[]
  ) {
    let finalRoute: FlightList[] = [];
    let flightIntermediate: any = [];
    //Se recorre los posibles origenes nuevos y se comparan con la información de todos los vuelos generales
    for (let index = 0; index < origins.length; index++) {
      this.flightList.forEach((item) => {
        if (
          item.arrivalStation === origin &&
          item.departureStation === origins[index]
        ) {
          //En caso de coincidir se pushea en la variable flightIntermediate la información del vuelo intermedio
          flightIntermediate.push(item);
        }
      });
    }

    if (flightIntermediate.length > 0) {
      possibleFlights.forEach((item) => {
        //Posteriormente si valida que en efecto el destino del primer vuelo coincida con el origen del segundo y tenga el destino final que se ingresó en el formulario
        if (item.arrivalStation === flightIntermediate[0].departureStation) {
          finalRoute.push(flightIntermediate[0], item);
        }
      });
    }
    if (finalRoute.length > 1) { //En caso de ser válido se construye la variable Journey en donde se imprimirá la información en la visual
      this.totalPrice = finalRoute[0].price + finalRoute[1].price;
      this.firstPrice = finalRoute[0].price;
      this.secondPrice = finalRoute[1].price;
      this.journey = {
        origin,
        destination,
        price: finalRoute[0].price + finalRoute[1].price,
        flight: [
          {
            origin: finalRoute[0].arrivalStation,
            destination: finalRoute[0].departureStation,
            prices: finalRoute[0].price,
            transport: {
              flightCarrier: finalRoute[0].flightCarrier,
              flightNumber: finalRoute[0].flightNumber,
            },
          },
          {
            origin: finalRoute[1].arrivalStation,
            destination: finalRoute[1].departureStation,
            prices: finalRoute[1].price,
            transport: {
              flightCarrier: finalRoute[1].flightCarrier,
              flightNumber: finalRoute[1].flightNumber,
            },
          },
        ],
      };
      this.viewInfo = true;
    } else if (finalRoute.length == 1) { //En caso de no encontrar un vuelo adicional, se construye la variable journey con la info del vuelo directo
      this.totalPrice = finalRoute[0].price;
      this.journey = {
        origin,
        destination,
        price: finalRoute[0].price,
        flight: [
          {
            origin: finalRoute[0].departureStation,
            destination: finalRoute[0].arrivalStation,
            prices: finalRoute[0].price,
            transport: {
              flightCarrier: finalRoute[0].flightCarrier,
              flightNumber: finalRoute[0].flightNumber,
            },
          },
        ],
      };
      this.viewInfo = true; //Variable que permite visualizar la información en la página
    } else { //En caso de no existir ninguna ruta directa ni indirecta arrojará esta alerta
      Swal.fire({
        icon: 'error',
        title: 'No es posible calcular esta ruta',
      });
      this.viewInfo = false;
    }

    this.calculationSize();
  }

  //Funcion para validad el tipo de moneda seleccionado
  validateCurrency() {
    this.form.controls.currency.valueChanges.subscribe((resp) => {
      setTimeout(() => {
        let idCurrency = this.form.value.currency;
        this.currencyType(idCurrency);
      }, 100);
    });
  }
  //Segun el tipo de moneda se realiza la validación para imprimir el nuevo precio convertido
  currencyType(id: any) {
    let value = id;

    switch (value) {
      case '1':
        this.totalPrice = this.journey.price;
        this.firstPrice = this.journey.flight[0].prices;
        this.secondPrice =
          this.journey.flight.length > 1 ? this.journey.flight[1].prices : 0;
        break;
      case '2':
        this.totalPrice = this.journey.price * 4900;
        this.firstPrice = this.journey.flight[0].prices * 4900;
        this.secondPrice =
          this.journey.flight.length > 1
            ? this.journey.flight[1].prices * 4900
            : 0;
        break;
      case '3':
        this.totalPrice = this.journey.price * 1.02;
        this.firstPrice = this.journey.flight[0].prices * 1.02;
        this.secondPrice =
          this.journey.flight.length > 1
            ? this.journey.flight[1].prices * 1.02
            : 0;
        break;
      default:
        break;
    }
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
