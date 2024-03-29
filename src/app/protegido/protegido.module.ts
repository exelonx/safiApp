import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

import { ProtegidoRoutingModule } from './protegido-routing.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './main/main.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { SeguridadModule } from './seguridad/seguridad.module';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AuthModule } from '../auth/auth.module';

import { SubNivelMenuComponent } from './shared/sidenav/components/sub-nivel-menu/sub-nivel-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from './shared/sidenav/components/toolbar/toolbar.component';
import { PreguntaEditComponent } from './perfil-usuario/components/pregunta-edit/pregunta-edit.component';
import { CampanaNotificacionComponent } from './shared/campana-notificacion/campana-notificacion.component';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    MainComponent,
    DashboardComponent,
    SidenavComponent,
    PerfilUsuarioComponent,
    SubNivelMenuComponent,
    ToolbarComponent,
    PreguntaEditComponent,
    CampanaNotificacionComponent
  ],
  imports: [
    CommonModule,
    ProtegidoRoutingModule,
    NgMaterialModule,
    SeguridadModule,
    AuthModule,
    ReactiveFormsModule,
    PipesModule,
    InfiniteScrollModule
  ]
})
export class ProtegidoModule { }
