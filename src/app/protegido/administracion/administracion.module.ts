import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { BitacoraComponent } from './pages/bitacora/bitacora.component';
import { NgMaterialModule } from 'src/app/ng-material/ng-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { EditarUsuarioComponent } from './pages/usuario/components/editar-usuario/editar-usuario.component';
import { NuevoUsuarioComponent } from './pages/usuario/components/nuevo-usuario/nuevo-usuario.component';
import { DesactivarUsuarioComponent } from './pages/usuario/components/desactivar-usuario/desactivar-usuario.component';
import { BaseDeDatosComponent } from './pages/base-de-datos/base-de-datos.component';
import { GenerarBackupComponent } from './pages/base-de-datos/pages/generar-backup/generar-backup/generar-backup.component';
import { RestaurarBackupComponent } from './pages/base-de-datos/pages/restaurar-backup/restaurar-backup.component';
import { DireccionComponent } from './pages/direccion/direccion.component';
import { MunicipioComponent } from './pages/municipio/municipio.component';
import { DepartamentoComponent } from './pages/departamento/departamento.component';


@NgModule({
  declarations: [
    BitacoraComponent,
    UsuarioComponent,
    EditarUsuarioComponent,
    NuevoUsuarioComponent,
    DesactivarUsuarioComponent,
    BaseDeDatosComponent,
    GenerarBackupComponent,
    RestaurarBackupComponent,
    DireccionComponent,
    MunicipioComponent,
    DepartamentoComponent,
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdministracionModule { }
