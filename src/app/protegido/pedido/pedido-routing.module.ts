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
import { ValidarPedidoFacturaGuard } from './guards/validar-pedido-factura.guard';
import { ValidarPantallaEstadoGuard } from './guards/validar-pantalla-estado.guard';
import { ValidarPantallaEditarDetalleGuard } from './guards/validar-pantalla-editar-detalle.guard';
import { ValidarPantallaFacturaGuard } from './guards/validar-pantalla-factura.guard';
import { ValidarPantallaCocinaGuard } from './guards/validar-pantalla-cocina.guard';
import { ReporteFacturasComponent } from './pages/reporte-facturas/reporte-facturas.component';

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
        component: CocinaComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarCajaGuard, ValidarPantallaCocinaGuard ]
      },
      {
        path: 'estado',
        component: EstadoComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaEstadoGuard ]
      },
      {
        path: 'descuento',
        component: DescuentoComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaDescuentoGuard ]
      },
      {
        path: 'factura/:id_pedido',
        component: FacturaComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPedidoFacturaGuard, ValidarPantallaFacturaGuard ]
      },
      {
        path: 'historial-factura',
        component: ReporteFacturasComponent,
        canActivate: [ ValidarTokenLoginGuard]
      },
      {
        path: 'vista-cliente',
        component: VistaClienteComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'editar/:id_detalle',
        component: EditarDetalleComponent,
        canActivate: [ValidarDetalleGuard, ValidarTokenLoginGuard, ValidarPantallaEditarDetalleGuard]
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
