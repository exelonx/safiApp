import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanLoad } from '@angular/router';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { MainComponent } from '../main/main.component';
import { AtencionComponent } from './pages/atencion/atencion.component';
import { CocinaComponent } from './pages/cocina/cocina.component';
import { ValidarCajaGuard } from './guards/validar-caja.guard';
import { EstadoComponent } from './pages/estado/estado.component';
import { DescuentoComponent } from './pages/descuento/descuento.component';
import { ValidarPantallaDescuentoGuard } from './guards/validar-pantalla-descuento.guard';
import { FacturaComponent } from './pages/factura/factura.component';
import { ValidarPantallaAtencionGuard } from './guards/validar-pantalla-atencion.guard';
import { EditarDetalleComponent } from './pages/atencion/components/editar-detalle/editar-detalle.component';
import { ValidarDetalleGuard } from './pages/atencion/components/editar-detalle/guards/validar-detalle.guard';
import { VistaClienteComponent } from './pages/vista-cliente/vista-cliente.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'atencion',
        component: AtencionComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarCajaGuard, ValidarPantallaAtencionGuard ]
      },
      {
        path: 'cocina',
        component: CocinaComponent
      },
      {
        path: 'estado',
        component: EstadoComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarCajaGuard ]
      },
      {
        path: 'descuento',
        component: DescuentoComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaDescuentoGuard ]
      },
      {
        path: 'factura',
        component: FacturaComponent,
        canActivate: []
      },
      {
        path: 'vista-cliente',
        component: VistaClienteComponent,
        canActivate: [ValidarTokenLoginGuard]
      },
      {
        path: 'editar/:id_detalle',
        component: EditarDetalleComponent,
        canActivate: [ValidarDetalleGuard, ValidarTokenLoginGuard]
      },
      {
        path: '**',
        redirectTo: 'atencion'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
