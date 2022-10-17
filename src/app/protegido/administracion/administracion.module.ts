import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { BitacoraComponent } from './pages/bitacora/bitacora.component';
import { NgMaterialModule } from 'src/app/ng-material/ng-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { EditarUsuarioComponent } from './pages/usuario/components/editar-usuario/editar-usuario.component';
import { NuevoUsuarioComponent } from './pages/usuario/components/nuevo-usuario/nuevo-usuario.component';
import { DesactivarUsuarioComponent } from './pages/usuario/components/desactivar-usuario/desactivar-usuario.component';


@NgModule({
  declarations: [
    BitacoraComponent,
    UsuarioComponent,
    EditarUsuarioComponent,
    NuevoUsuarioComponent,
    DesactivarUsuarioComponent,
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule
  ]
})
export class AdministracionModule { }
