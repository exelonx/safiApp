import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { RolComponent } from './pages/rol/rol.component';
import { NgMaterialModule } from '../../ng-material/ng-material.module';
import { PreguntaComponent } from './pages/pregunta/pregunta.component';
import { NuevaPreguntaComponent } from './pages/pregunta/components/nueva-pregunta/nueva-pregunta.component';
import { EditarPreguntaComponent } from './pages/pregunta/components/editar-pregunta/editar-pregunta.component';
import { NuevoRolComponent } from './pages/rol/components/nuevo-rol/nuevo-rol.component';
import { EditarRolComponent } from './pages/rol/components/editar-rol/editar-rol.component';
import { PermisoComponent } from './pages/permiso/permiso.component';
import { ParametroComponent } from './pages/parametro/parametro.component';
import { EditarParametroComponent } from './pages/parametro/components/editar-parametro/editar-parametro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevoParametroComponent } from './pages/parametro/components/nuevo-parametro/nuevo-parametro.component';


@NgModule({
  declarations: [
    RolComponent,
    PreguntaComponent,
    NuevaPreguntaComponent,
    EditarPreguntaComponent,
    NuevoRolComponent,
    EditarRolComponent,
    PermisoComponent,
    ParametroComponent,
    EditarParametroComponent,
    NuevoParametroComponent
  ],
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule
  ],
  exports:[

  ]
})
export class SeguridadModule { }
