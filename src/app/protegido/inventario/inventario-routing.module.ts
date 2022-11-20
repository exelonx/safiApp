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

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'insumo',
        component: InsumoComponent,
        canActivate: [ ValidarTokenLoginGuard]
      },
      {
        path: 'inventario',
        component: InventarioComponent,
        canActivate: [ ValidarTokenLoginGuard]
      },
      {
        path: 'kardex/:id_insumo',
        component: KardexComponent,
        canActivate: [ ValidarTokenLoginGuard, ValidarIdInsumoGuard]
      },
      {
        path: 'unidad',
        component: UnidadComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'proveedor',
        component: ProveedorComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      },
      {
        path: 'compras',
        component: ComprasComponent,
        canActivate: [ ValidarTokenLoginGuard ]
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
