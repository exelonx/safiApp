import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { BitacoraComponent } from './pages/bitacora/bitacora.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { BaseDeDatosComponent } from './pages/base-de-datos/base-de-datos.component';
import { ValidarPantallaUsuarioGuard } from './guards/validar-pantalla-usuario.guard';
import { ValidarPantallaBitacoraGuard } from './guards/validar-pantalla-bitacora.guard';
import { ValidarPantallaBaseDeDatosGuard } from './guards/validar-pantalla-base-de-datos.guard';
import { DepartamentoComponent } from './pages/departamento/departamento.component';
import { DireccionComponent } from './pages/direccion/direccion.component';
import { MunicipioComponent } from './pages/municipio/municipio.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuario',
        component: UsuarioComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaUsuarioGuard ]
      },
      {
        path: 'bitacora',
        component: BitacoraComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaBitacoraGuard ]
      },
      {
        path: 'base-de-datos',
        component: BaseDeDatosComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaBaseDeDatosGuard ]
      },
      {
        path: 'departamento',
        component: DepartamentoComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaBaseDeDatosGuard ]
      },
      {
        path: 'direccion',
        component: DireccionComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaBaseDeDatosGuard ]
      },
      {
        path: 'municipio',
        component: MunicipioComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaBaseDeDatosGuard ]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
