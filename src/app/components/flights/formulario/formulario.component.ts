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
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent {
  @Output() flightList: FlightList[] = [];
  @Output() journey: EventEmitter<Journey> = new EventEmitter<Journey>();

  //Variables
  @Output() arrivalStations: string[] = [];
  @Output() departureStations: string[] = [];

  @Output() viewInfo: EventEmitter<boolean> = new EventEmitter<boolean>();
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
  ngOnInit() {
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
    // Declaración de variables
    this.viewInformation = false;
    this.viewInfo.emit(this.viewInformation);
    this.form.controls.currency.setValue('');

    const origin = this.form.value.origin.toUpperCase();
    const destination = this.form.value.destination.toUpperCase();

    const findRoute = (
      currentOrigin: string,
      currentDestination: string,
      currentJourney: Journey,
      visitedStations: Set<string>
    ): Journey | null => {
      visitedStations.add(currentOrigin); // Marcar la estación actual como visitada

      const directFlight = this.flightList.find(
        (flight) =>
          flight.departureStation === currentOrigin &&
          flight.arrivalStation === currentDestination
      );

      if (directFlight) {
        currentJourney.price += directFlight.price;
        currentJourney.flight.push({
          origin: directFlight.departureStation,
          destination: directFlight.arrivalStation,
          prices: directFlight.price,
          transport: {
            flightCarrier: directFlight.flightCarrier,
            flightNumber: directFlight.flightNumber,
          },
        });
        return currentJourney;
      }

      for (const flight of this.flightList) {
        if (
          flight.departureStation === currentOrigin &&
          !visitedStations.has(flight.arrivalStation) // Evitar ciclos
        ) {
          const intermediateJourney = findRoute(
            flight.arrivalStation,
            currentDestination,
            {
              origin,
              destination,
              price: currentJourney.price + flight.price,
              flight: [
                ...currentJourney.flight,
                {
                  origin: flight.departureStation,
                  destination: flight.arrivalStation,
                  prices: flight.price,
                  transport: {
                    flightCarrier: flight.flightCarrier,
                    flightNumber: flight.flightNumber,
                  },
                },
              ],
            },
            visitedStations
          );

          if (intermediateJourney) {
            return intermediateJourney;
          }
        }
      }

      return null;
    };

    const visitedStations = new Set<string>();
    const resultJourney = findRoute(
      origin,
      destination,
      {
        origin,
        destination,
        price: 0,
        flight: [],
      },
      visitedStations
    );

    if (resultJourney) {
      this.journeyValue = resultJourney;
      this.journey.emit(this.journeyValue);
      this.viewInformation = true;
      this.viewInfo.emit(this.viewInformation);
    } else if (
      visitedStations.has(origin) ||
      visitedStations.has(destination)
    ) {
      // Si el origen o el destino no existen en el servicio, mostrar la alerta
      Swal.fire({
        icon: 'error',
        title: 'No existe ruta para ese origen y/o destino',
      });
      this.viewInformation = false;
      this.viewInfo.emit(this.viewInformation);
    } else {
      // Si se han visitado estaciones (existen opciones), pero no hay una ruta válida
      Swal.fire({
        icon: 'error',
        title: 'No es posible calcular esta ruta',
      });
      this.viewInformation = false;
      this.viewInfo.emit(this.viewInformation);
    }

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
    if (finalRoute.length > 1) {
      //En caso de ser válido se construye la variable Journey en donde se imprimirá la información en la visual
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
      this.journey.emit(this.journeyValue);
      this.viewInformation = true;
      this.viewInfo.emit(this.viewInformation);
    } else if (finalRoute.length == 1) {
      //En caso de no encontrar un vuelo adicional, se construye la variable journey con la info del vuelo directo
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
      this.journey.emit(this.journeyValue);
      this.viewInformation = true;
      this.viewInfo.emit(this.viewInformation); //Variable que permite visualizar la información en la página
    } else {
      //En caso de no existir ninguna ruta directa ni indirecta arrojará esta alerta
      Swal.fire({
        icon: 'error',
        title: 'No es posible calcular esta ruta',
      });
      this.journey.emit(this.journeyValue);
      this.viewInformation = false;
      this.viewInfo.emit(this.viewInformation);
    }
    console.log(this.viewInformation);
    this.componentFligth.calculationSize();
  }

  // Función para validar el tipo de moneda seleccionado
  validateCurrency() {
    this.form.get('currency')?.valueChanges.subscribe((resp) => {
      setTimeout(() => {
        this.currencyType(resp); // Llamar la función currencyType con el nuevo valor
      }, 100);
    });
  }

  // Función para actualizar los precios según el tipo de moneda
  // Función para actualizar los precios según el tipo de moneda
  currencyType(id: any) {
    const value = id;

    switch (value) {
      case '1':
        this.viewTotalPrice = this.calculatePrice(1);
        break;
      case '2':
        this.viewTotalPrice = this.calculatePrice(4000);
        break;
      case '3':
        this.viewTotalPrice = this.calculatePrice(1.02);
        break;
      default:
        break;
    }
  }

  calculatePrice(conversionFactor: number): number {
    let totalPrice = 0;
    let originalPriceTotal = 0; // Nuevo valor para almacenar el precio original total

    this.journeyValue.flight.forEach((flight, index) => {
      const originalPrice = this.flightList[index].price;
      flight.prices = originalPrice * conversionFactor;
      totalPrice += flight.prices;
      originalPriceTotal += originalPrice;
    });

    // Actualiza el precio total original
    this.journeyValue.price = originalPriceTotal * conversionFactor;

    return totalPrice;
  }
}
