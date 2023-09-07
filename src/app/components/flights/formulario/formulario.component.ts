import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { FlightList } from 'src/app/interfaces/flight.interface';
import { Journey } from 'src/app/models/journey';
import Swal from 'sweetalert2';
import { FlightsComponent } from '../flights.component';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  @Output() flightList: FlightList[] = [];
  @Output()journey: EventEmitter<Journey> = new EventEmitter<Journey>();

  //Variables
  @Output() arrivalStations: string[] = [];
  @Output() departureStations: string[] = [];

  @Output() viewInfo: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() totalPrice: EventEmitter<number> = new EventEmitter<number>();
  @Output() firstPrice: EventEmitter<number> = new EventEmitter<number>();
  @Output() secondPrice: EventEmitter<number> = new EventEmitter<number>();

  valueFirstPrice: number = 0;
  valueSecondPrice: number = 0;
  viewTotalPrice: number = 0;
  viewInformation: boolean = false;
  journeyValue!: Journey;

  //Declaración formulario e inputs
  form: FormGroup = this.fb.group({
    origin: ['', [Validators.required, Validators.minLength(3)]], //Validaciones cantidad de caracteres permitidos y obligatoriedad
    destination: ['', [Validators.required, Validators.minLength(3)]],
    currency: [''],

  });
  componentFligth: FlightsComponent;
  constructor(private fb: FormBuilder, private serviceFlight: FlightService) {}
  ngOnInit(){
    this.validateCurrency();
    this.getInfo();
  }
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
    this.viewInformation= false;
    this.viewInfo.emit(this.viewInformation);
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
          this.viewTotalPrice = this.flightList[i].price;
          this.journeyValue = {
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
          this.totalPrice.emit(this.viewTotalPrice)
          this.journey.emit(this.journeyValue);
          this.viewInformation= true;
          this.viewInfo.emit(this.viewInformation);
          break;
        } else if (
          this.flightList[i].departureStation === destination &&
          this.flightList[i].arrivalStation === origin
        ) {
          this.viewTotalPrice = this.flightList[i].price;
          this.journeyValue = {
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
          this.totalPrice.emit(this.viewTotalPrice)
          this.viewInformation= true;
          this.viewInfo.emit(this.viewInformation);
          break;
        } else if (this.flightList[i].departureStation === destination) {
          // en caso de no ser directo guarda en la variable possibleFlights y newOrigins la información que coincide con el destino del formulario
          possibleFlights.push(this.flightList[i]);
          newOrigins.push(this.flightList[i].arrivalStation);
        }
      }
      //Posteriormete de no ser directo el vuelo se llama la funcion this.getAvailableRoutes() para validar coincidencias y obtener el vuelo adicional
      !this.viewInformation
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
      this.viewInformation= false;
      this.viewInfo.emit(this.viewInformation);
    }
    //Se realiza el calculo del tamaño de los componentes
    this.componentFligth.calculationSize();
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
      this.viewTotalPrice = finalRoute[0].price + finalRoute[1].price;
      this.valueFirstPrice = finalRoute[0].price;
      this.valueSecondPrice = finalRoute[1].price;
      this.journeyValue = {
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
      this.totalPrice.emit(this.viewTotalPrice)
      this.firstPrice.emit(this.valueFirstPrice)
      this.secondPrice.emit(this.valueSecondPrice)
      this.journey.emit(this.journeyValue);
      this.viewInformation= true;
      this.viewInfo.emit(this.viewInformation);
    } else if (finalRoute.length == 1) { //En caso de no encontrar un vuelo adicional, se construye la variable journey con la info del vuelo directo
      this.viewTotalPrice = finalRoute[0].price;
      this.journeyValue = {
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
      this.totalPrice.emit(this.viewTotalPrice)
      this.journey.emit(this.journeyValue);
      this.viewInformation= true;
      this.viewInfo.emit(this.viewInformation)//Variable que permite visualizar la información en la página
    } else { //En caso de no existir ninguna ruta directa ni indirecta arrojará esta alerta
      Swal.fire({
        icon: 'error',
        title: 'No es posible calcular esta ruta',
      });
      this.totalPrice.emit(this.viewTotalPrice)
      this.journey.emit(this.journeyValue);
      this.viewInformation= false;
      this.viewInfo.emit(this.viewInformation);
    }
    console.log(this.viewInformation)
    this.componentFligth.calculationSize();
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
  currencyType(id: any) {
    let value = id;

    switch (value) {
      case '1':
        this.viewTotalPrice = this.journeyValue.price;
        this.valueFirstPrice = this.journeyValue.flight[0].prices;
        this.valueSecondPrice =
          this.journeyValue.flight.length > 1 ? this.journeyValue.flight[1].prices : 0;
          this.totalPrice.emit(this.viewTotalPrice)
          this.firstPrice.emit(this.valueFirstPrice)
          this.secondPrice.emit(this.valueSecondPrice)
        break;
      case '2':
        this.viewTotalPrice = this.journeyValue.price * 4900;
        this.valueFirstPrice = this.journeyValue.flight[0].prices * 4900;
        this.valueSecondPrice =
          this.journeyValue.flight.length > 1
            ? this.journeyValue.flight[1].prices * 4900
            : 0;
            this.totalPrice.emit(this.viewTotalPrice)
            this.firstPrice.emit(this.valueFirstPrice)
            this.secondPrice.emit(this.valueSecondPrice)
        break;
      case '3':
        this.viewTotalPrice = this.journeyValue.price * 1.02;
        this.valueFirstPrice = this.journeyValue.flight[0].prices * 1.02;
        this.valueSecondPrice =
          this.journeyValue.flight.length > 1
            ? this.journeyValue.flight[1].prices * 1.02
            : 0;
            this.totalPrice.emit(this.viewTotalPrice)
            this.firstPrice.emit(this.valueFirstPrice)
            this.secondPrice.emit(this.valueSecondPrice)
        break;
      default:
        break;
    }
  }
}

