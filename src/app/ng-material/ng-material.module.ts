import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { getPaginatorIntl } from './functions/getPaginatorIntl.function';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [],
  exports: [
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatRippleModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getPaginatorIntl() }
  ]
})
export class NgMaterialModule { }
