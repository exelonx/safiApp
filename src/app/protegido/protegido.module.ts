import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtegidoRoutingModule } from './protegido-routing.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './main/main.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    MainComponent,
    DashboardComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    ProtegidoRoutingModule,
    NgMaterialModule
  ]
})
export class ProtegidoModule { }
