import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenLoginGuard } from '../guards/validar-token-login.guard';
import { InsumoComponent } from './pages/insumo/insumo.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { KardexComponent } from './pages/kardex/kardex.component';
import { UnidadComponent } from './pages/unidad/unidad.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { ValidarIdInsumoGuard } from './pages/kardex/guards/validar-id-insumo.guard';
import { ValidarPantallaInsumoGuard } from './guards/validar-pantalla-insumo.guard';
import { ValidarPantallaUnidadGuard } from './guards/validar-pantalla-unidad.guard';
import { ValidarPantallaProveedorGuard } from './guards/validar-pantalla-proveedor.guard';
import { ValidarPantallaComprasGuard } from './guards/validar-pantalla-compras.guard';
import { ValidarPantallaInventarioGuard } from './guards/validar-pantalla-inventario.guard';
import { ValidarPantallaKardexGuard } from './guards/validar-pantalla-kardex.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'insumo',
        component: InsumoComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaInsumoGuard]
      },
      {
        path: 'inventario',
        component: InventarioComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaInventarioGuard]
      },
      {
        path: 'kardex/:id_insumo',
        component: KardexComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaKardexGuard]
      },
      {
        path: 'unidad',
        component: UnidadComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaUnidadGuard ]
      },
      {
        path: 'proveedor',
        component: ProveedorComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaProveedorGuard ]
      },
      {
        path: 'compras',
        component: ComprasComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarPantallaComprasGuard ]
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
