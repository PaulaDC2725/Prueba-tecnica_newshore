import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatExpansionModule } from '@angular/material/expansion';
import { OnlyDirective } from './directives/only.directive';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlightsComponent } from './components/flights/flights.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './core/material/material.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ThemePalette } from '@angular/material/core';
import { FormularioComponent } from './components/flights/formulario/formulario.component';
import { TablaComponent } from './components/flights/tabla/tabla.component';

  @NgModule({
  declarations: [AppComponent, FlightsComponent, OnlyDirective, FormularioComponent, TablaComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    TooltipModule,
    MatExpansionModule,
  ],
  exports: [OnlyDirective],
  providers: [FormularioComponent, TablaComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
