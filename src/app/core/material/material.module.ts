import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// MATERIAL IMPORTS
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTreeModule } from '@angular/material/tree';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider'
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';

@NgModule({
  imports: [],
  exports: [
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatTabsModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatStepperModule,
    MatRadioModule,
    MatSliderModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressBarModule,
    MatInputModule,
    MatGridListModule,
    NgxMatSelectSearchModule,
    MatSelectInfiniteScrollModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline', floatLabel: 'always'}}
  ]
})
export class MaterialModule { }
