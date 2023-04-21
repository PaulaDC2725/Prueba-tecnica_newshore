# PruebaTecnicaNewshore

Este proyecto fue creado con [Angular CLI](https://github.com/angular/angular-cli) version 15.2.6.

## Tener en cuenta antes de ejecutar el proyecto

Version node (v16.16.0)
Ejecutar el comando npm -install --force en la terminal para descargar todas las dependencias utilizadas en el proyecto,
Adicionalmente descargar la dependencia  '@ng-idle/core' ejecutando este comando 'npm install @ng-idle/core --force'

## Objetivos logrados

1- Se realizó modelado de clases según lo solicitado en el documento
2- Se realizó el consumo de API nivel 3 "Rutas múltiples y de retorno"
3- Se realizaron diferentes validaciones en el formulario, por ejemplo:
  - Los valores de 'Origin' y 'Destination' no pueden ser los mismos.
  - Los inputs no permiten números, esta validación se realizó con el uso de una directiva.
  - Solamente se permiten ingresar 3 carácteres
  - El ingreso de los input únicamente se viadualiza en mayúscula

Carácterístas adicionales:
- Se implementaron propiedades de Angular Material (Acordiones, inputs y algunas clases generales), implementación "Sweet alert" para indicar errores al usuario (Control de excepciones) 
4- El proyecto se entrega totalmente funcional para los casos de vuelos directos y de una escala (dos vuelos), a partir de 2 escalas en su totalidad no se ejecuta correctamente
5- Se realiza correctamente el cambio de moneda según el tipo que se selecciona en el formulario

##  Dificultades 

- Como se mencionó en el punto anterior todas las rutas de vuelos directos y vuelos a una escala se ejecutan correctamente, sin embargo aquellas rutas que requieren de tres o más vuelos no funcionan en su totalidad.

## Herramientas sin utilizar
- Test unitarios
-States manager: Debido a que actualmente no manejo muy bien el tema y de lo que logré investigar y entender no vi necesario la implementación de estos debido al alcance del proyecto!
-El uso de interceptores e inyection tokens no se vio necesaria de usar para este proyecto. 
