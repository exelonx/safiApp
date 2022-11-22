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
import { CajaComponent } from './pages/caja/caja.component';
import { ValidarPantallaCajaGuard } from './guards/validar-pantalla-caja.guard';
import { ValidarPantallaSARGuard } from './guards/validar-pantalla-sar.guard';
import { CAIComponent } from './pages/cai/cai.component';

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
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'direccion',
        component: DireccionComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'municipio',
        component: MunicipioComponent,
        canActivate: [ ValidarTokenLoginGuard]
      },
      {
        path: 'caja',
        component: CajaComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaCajaGuard ]
      },
      {
        path: 'cai',
        component: CAIComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaSARGuard ]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
