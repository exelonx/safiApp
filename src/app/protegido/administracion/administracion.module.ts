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
import { CajaComponent } from './pages/caja/caja.component';
import { HistorialCajaComponent } from './pages/caja/components/historial-caja/historial-caja.component';
import { CAIComponent } from './pages/cai/cai.component';
import { NuevoCAIComponent } from './pages/cai/components/nuevo-cai/nuevo-cai.component';
import { EditarCAIComponent } from './pages/cai/components/editar-cai/editar-cai.component';
import { EliminarCAIComponent } from './pages/cai/components/eliminar-cai/eliminar-cai.component';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AbriCajaComponent } from './pages/caja/components/abri-caja/abri-caja.component';
import { DetalleUsuarioComponent } from './pages/usuario/components/detalle-usuario/detalle-usuario/detalle-usuario.component'

export const options: Partial<null|IConfig> | (() => Partial<IConfig>) = null;


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
    CajaComponent,
    HistorialCajaComponent,
    CAIComponent,
    NuevoCAIComponent,
    EditarCAIComponent,
    EliminarCAIComponent,
    AbriCajaComponent,
    DetalleUsuarioComponent
  ],
  imports: [
    CommonModule,
    AdministracionRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
  ]
})
export class AdministracionModule { }
