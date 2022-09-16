import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtegidoRoutingModule } from './protegido-routing.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    ProtegidoRoutingModule
  ]
})
export class ProtegidoModule { }
