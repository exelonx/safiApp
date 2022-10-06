import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtegidoRoutingModule } from './protegido-routing.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './main/main.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { UsuarioComponent } from './seguridad/pages/usuario/usuario.component';
import { SeguridadModule } from './seguridad/seguridad.module';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AuthModule } from '../auth/auth.module';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    MainComponent,
    DashboardComponent,
    SidenavComponent,
    PerfilUsuarioComponent
  ],
  imports: [
    CommonModule,
    ProtegidoRoutingModule,
    NgMaterialModule,
    SeguridadModule,
    AuthModule
  ]
})
export class ProtegidoModule { }
