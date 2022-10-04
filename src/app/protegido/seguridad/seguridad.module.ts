import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { RolComponent } from './pages/rol/rol.component';
import { NgMaterialModule } from '../../ng-material/ng-material.module';



@NgModule({
  declarations: [
    UsuarioComponent,
    RolComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    NgMaterialModule
  ],
  exports:[

    UsuarioComponent

  ]
})
export class SeguridadModule { }
